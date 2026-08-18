import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createCheckoutSession, PLANS, verifyWebhookSignature } from './paymongo.js';
import { fulfillPayMongoCheckoutPaid } from './payment-webhook.js';
import { fulfillAdMobReward } from './rewarded-ad.js';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const JWT_SECRET = process.env.JWT_SECRET;
const DEMO_MODE = process.env.DEMO_MODE === 'true';
if (!JWT_SECRET) throw new Error('JWT_SECRET is required');

const allowedOrigin = process.env.FRONTEND_ORIGIN;
app.use(helmet());
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : { origin: false }));

const rateBuckets = new Map();
const RATE_WINDOW_MS = 60_000;
const RATE_LIMIT = 120;
function rateLimit(req, res, next) {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  const bucket = rateBuckets.get(key);
  if (!bucket || now - bucket.startedAt >= RATE_WINDOW_MS) {
    rateBuckets.set(key, { startedAt: now, count: 1 });
    return next();
  }
  bucket.count += 1;
  if (bucket.count > RATE_LIMIT) return res.status(429).json({ error: 'Too many requests' });
  return next();
}
app.use(rateLimit);

app.get('/health', (_req, res) => res.json({ ok: true, service: 'tagalogdrama-api' }));

app.post('/payments/webhook', express.raw({ type: 'application/json', limit: '100kb' }), async (req, res) => {
  const signature = req.headers['paymongo-signature'];
  const secret = process.env.PAYMONGO_WEBHOOK_SECRET;
  if (!secret) return res.status(503).json({ error: 'Payment webhook is not configured' });
  let payload;
  try {
    const rawBody = req.body.toString('utf8');
    payload = JSON.parse(rawBody);
    const livemode = payload?.data?.attributes?.livemode === true;
    if (!verifyWebhookSignature(rawBody, signature, secret, livemode)) return res.status(401).json({ error: 'Invalid webhook signature' });
  } catch {
    return res.status(400).json({ error: 'Invalid webhook payload' });
  }
  if (payload?.data?.attributes?.type !== 'checkout_session.payment.paid') return res.status(200).json({ received: true, ignored: true });
  try {
    const result = await fulfillPayMongoCheckoutPaid(payload);
    return res.status(200).json({ received: true, ...result });
  } catch (error) {
    console.error('PayMongo fulfillment failed', error.message);
    return res.status(503).json({ error: 'Payment fulfillment temporarily unavailable' });
  }
});

// AdMob Server-Side Verification (SSV) callback. AdMob signs the full callback query;
// this endpoint grants the reward only after Google's signature is verified server-side.
app.get('/ads/admob/ssv', async (req, res) => {
  try {
    const result = await fulfillAdMobReward(`${req.protocol}://${req.get('host')}${req.originalUrl}`);
    return res.status(200).send('OK');
  } catch (error) {
    console.error('AdMob SSV verification failed', error.message);
    return res.status(400).send('Invalid reward');
  }
});

app.use(express.json({ limit: '100kb' }));
const catalogPath = path.resolve(process.cwd(), '../data/dramas.json');
const emailSchema = z.string().email().max(254);
const progressSchema = z.object({ secondsWatched: z.number().int().min(0).max(24 * 60 * 60) });
const planSchema = z.object({ plan: z.enum(['daily', 'weekly', 'monthly']) });

async function catalog() { return JSON.parse(await fs.readFile(catalogPath, 'utf8')); }

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token' }); }
}

app.post('/auth/login', async (req, res) => {
  if (!DEMO_MODE) return res.status(503).json({ error: 'Authentication provider not configured' });
  const parsed = emailSchema.safeParse(req.body?.email);
  if (!parsed.success) return res.status(400).json({ error: 'Valid email required' });
  const user = { id: `demo-${Buffer.from(parsed.data).toString('hex').slice(0, 24)}`, email: parsed.data };
  const token = jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
  res.json({ user, token, demo: true });
});
app.get('/me', auth, (req, res) => res.json({ user: req.user }));
app.get('/series', async (_req, res) => res.json(await catalog()));
app.get('/series/:id', async (req, res) => { const data = await catalog(); const series = data.series.find(item => item.id === req.params.id); if (!series) return res.status(404).json({ error: 'Series not found' }); res.json(series); });
app.get('/series/:id/episodes', async (req, res) => { const data = await catalog(); const series = data.series.find(item => item.id === req.params.id); if (!series) return res.status(404).json({ error: 'Series not found' }); res.json({ seriesId: series.id, episodes: series.episodes }); });

// Direct client requests cannot mint an ad reward. The app must show a real rewarded ad,
// and AdMob's SSV callback above grants the short-lived unlock.
app.post('/episodes/:id/unlock-ad', auth, (_req, res) => res.status(409).json({ error: 'Show the rewarded ad first; unlock is granted by verified AdMob SSV.' }));

app.get('/episodes/:id/access', auth, async (req, res) => {
  const client = await (await import('pg')).default.Pool ? null : null;
  return res.status(501).json({ error: 'Access entitlement query not configured in this route yet' });
});

app.post('/episodes/:id/play', auth, async (req, res) => {
  const data = await catalog();
  const episode = data.series.flatMap(s => s.episodes).find(e => e.id === req.params.id);
  if (!episode) return res.status(404).json({ error: 'Episode not found' });
  if (!episode.videoUrl) return res.status(503).json({ error: 'Video not configured yet' });
  if (!DEMO_MODE) return res.status(501).json({ error: 'Protected playback is not configured' });
  res.json({ episodeId: episode.id, playbackUrl: episode.videoUrl, expiresIn: 300, demo: true });
});
app.put('/episodes/:id/progress', auth, (req, res) => { const parsed = progressSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'secondsWatched must be an integer from 0 to 86400' }); res.json({ ok: true, episodeId: req.params.id, secondsWatched: parsed.data.secondsWatched }); });
app.get('/plans', (_req, res) => res.json(Object.entries(PLANS).map(([id, plan]) => ({ id, name: plan.name.replace('TagalogDrama ', ''), pricePHP: plan.amount / 100, durationDays: plan.durationDays }))));
app.post('/subscriptions/checkout', auth, async (req, res) => {
  const parsed = planSchema.safeParse(req.body); if (!parsed.success) return res.status(400).json({ error: 'Invalid plan' });
  if (!process.env.PAYMONGO_SECRET_KEY) return res.status(503).json({ error: 'Payment provider not configured' });
  const frontend = process.env.FRONTEND_ORIGIN; if (!frontend) return res.status(503).json({ error: 'Frontend origin is not configured' });
  try { const result = await createCheckoutSession({ plan: parsed.data.plan, userId: req.user.id, email: req.user.email, successUrl: `${frontend}/payment-success.html`, cancelUrl: `${frontend}/subscription.html`, idempotencyKey: `td-${req.user.id}-${parsed.data.plan}-${String(req.headers['idempotency-key'] || Date.now())}` }); return res.status(201).json(result); }
  catch (error) { console.error('PayMongo checkout creation failed', error.message); return res.status(502).json({ error: 'Unable to create payment checkout' }); }
});

app.use((err, _req, res, _next) => { console.error(err); res.status(500).json({ error: 'Internal server error' }); });
app.listen(PORT, () => console.log(`TagalogDrama API listening on ${PORT}`));
