import crypto from 'node:crypto';
import pg from 'pg';

const { Pool } = pg;
let pool;
let verifierKeys;
let verifierKeysExpiresAt = 0;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for rewarded-ad fulfillment');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

async function getVerifierKeys() {
  if (verifierKeys && Date.now() < verifierKeysExpiresAt) return verifierKeys;
  const response = await fetch('https://www.gstatic.com/admob/reward/verifier-keys.json');
  if (!response.ok) throw new Error(`Unable to fetch AdMob verifier keys: ${response.status}`);
  const data = await response.json();
  verifierKeys = new Map((data.keys || []).map(key => [String(key.keyId), key.pem || key.publicKeyPem]));
  verifierKeysExpiresAt = Date.now() + 6 * 60 * 60 * 1000;
  return verifierKeys;
}

function buildSignedQuery(url) {
  const parsed = new URL(url);
  const signature = parsed.searchParams.get('signature');
  const keyId = parsed.searchParams.get('key_id');
  if (!signature || !keyId) throw new Error('Missing AdMob signature or key_id');
  const signed = new URLSearchParams(parsed.searchParams);
  signed.delete('signature');
  signed.delete('key_id');
  return { keyId, signature, signedPayload: signed.toString() };
}

export async function verifyAdMobSsv(url) {
  const { keyId, signature, signedPayload } = buildSignedQuery(url);
  const keys = await getVerifierKeys();
  const pem = keys.get(keyId);
  if (!pem) throw new Error('Unknown AdMob verifier key');
  const verifier = crypto.createVerify('SHA256');
  verifier.update(signedPayload);
  verifier.end();
  const valid = verifier.verify(pem, Buffer.from(signature, 'base64'));
  if (!valid) throw new Error('Invalid AdMob SSV signature');
  return new URL(url);
}

export async function fulfillAdMobReward(requestUrl) {
  const url = await verifyAdMobSsv(requestUrl);
  const transactionId = url.searchParams.get('transaction_id');
  const customData = url.searchParams.get('custom_data');
  const rewardAmount = Number(url.searchParams.get('reward_amount'));
  const rewardItem = url.searchParams.get('reward_item');
  const timestamp = Number(url.searchParams.get('timestamp'));

  if (!transactionId || !customData || !Number.isFinite(timestamp)) throw new Error('Incomplete AdMob reward callback');
  if (rewardAmount <= 0 || rewardItem !== 'episode_unlock') throw new Error('Unexpected AdMob reward');
  if (Math.abs(Date.now() - timestamp) > 10 * 60 * 1000) throw new Error('Expired AdMob reward callback');

  let reward;
  try { reward = JSON.parse(Buffer.from(customData, 'base64url').toString('utf8')); }
  catch { throw new Error('Invalid AdMob custom_data'); }
  if (!reward.userId || !reward.episodeId) throw new Error('AdMob reward is missing user or episode');

  const expiresAt = new Date(Date.now() + 30 * 60 * 1000);
  const client = await getPool().connect();
  try {
    await client.query('BEGIN');
    const result = await client.query(
      `insert into public.ad_unlocks (user_id, episode_id, unlocked_at, expires_at)
       values ($1,$2,now(),$3)
       on conflict (user_id, episode_id) do update
       set unlocked_at=now(), expires_at=excluded.expires_at
       where public.ad_unlocks.expires_at < excluded.expires_at
       returning user_id, episode_id, expires_at`,
      [reward.userId, reward.episodeId, expiresAt]
    );
    await client.query('COMMIT');
    return { transactionId, userId: reward.userId, episodeId: reward.episodeId, expiresAt: result.rows[0]?.expires_at || expiresAt };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
