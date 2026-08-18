import pg from 'pg';

const { Pool } = pg;
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for access checks');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

export async function getEpisodeAccess(userId, episodeId) {
  const client = await getPool().connect();
  try {
    const episodeResult = await client.query(
      `select id, access_type, video_asset_id from public.episodes where id=$1`,
      [episodeId]
    );
    if (!episodeResult.rowCount) return { allowed: false, reason: 'episode_not_found' };
    const episode = episodeResult.rows[0];

    if (episode.access_type === 'subscription') {
      const result = await client.query(
        `select plan, expires_at from public.subscriptions
         where user_id=$1 and status='active' and expires_at > now()
         order by expires_at desc limit 1`,
        [userId]
      );
      if (!result.rowCount) return { allowed: false, reason: 'subscription_required' };
      return { allowed: true, access: 'subscription', plan: result.rows[0].plan, expiresAt: result.rows[0].expires_at };
    }

    const result = await client.query(
      `select expires_at from public.ad_unlocks
       where user_id=$1 and episode_id=$2 and expires_at > now()`,
      [userId, episodeId]
    );
    if (!result.rowCount) return { allowed: false, reason: 'rewarded_ad_required' };
    return { allowed: true, access: 'rewarded_ad', expiresAt: result.rows[0].expires_at };
  } finally {
    client.release();
  }
}
