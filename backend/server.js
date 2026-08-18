import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import fs from 'node:fs/promises';
import path from 'node:path';

const app = express();
const PORT = Number(process.env.PORT || 8080);
const JWT_SECRET = process.env.JWT_SECRET;
const DEMO_MODE = process.env.DEMO_MODE === 'true';
if (!JWT_SECRET) throw new Error('JWT_SECRET is required');

const allowedOrigin = process.env.FRONTEND_ORIGIN;
app.use(helmet());
app.use(cors(allowedOrigin ? { origin: allowedOrigin } : { origin: false }));
app.use(express.json({ limit: '100kb' }));

const catalogPath = path.resolve(process.cwd(), '../data/dramas.json');
const emailSchema = z.string().email().max(254);

async function catalog() {
  return JSON.parse(await fs.readFile(catalogPath, 'utf8'));
}

function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/health', (_req, res) => res.json({ ok: true, service: 'tagalogdrama-api' }));

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
app.get('/series/:id', async (req, res) => {
  const data = await catalog();
  const series = data.series.find(item => item.id === req.params.id);
  if (!series) return res.status(404).json({ error: 'Series not found' });
  res.json(series);
});

app.get('/series/:id/episodes', async (req, res) => {
  const data = await catalog();
  const series = data.series.find(item => item.id === req.params.id);
  if (!series) return res.status(404).json({ error: 'Series not found' });
  res.json({ seriesId: series.id, episodes: series.episodes });
});

app.post('/episodes/:id/unlock-ad', auth, (_req, res) => {
  return res.status(501).json({ error: 'Rewarded ads are not configured; no entitlement was granted.' });
});

app.post('/episodes/:id/play', auth, async (req, res) => {
  const data = await catalog();
  const episode = data.series.flatMap(s => s.episodes).find(e => e.id === req.params.id);
  if (!episode) return res.status(404).json({ error: 'Episode not found' });
  if (!episode.videoUrl) return res.status(503).json({ error: 'Video not configured yet' });
  if (!DEMO_MODE) return res.status(501).json({ error: 'Protected playback is not configured' });
  res.json({ episodeId: episode.id, playbackUrl: episode.videoUrl, expiresIn: 300, demo: true });
});

app.put('/episodes/:id/progress', auth, (req, res) => {
  const seconds = Number(req.body?.secondsWatched);
  if (!Number.isInteger(seconds) || seconds < 0) return res.status(400).json({ error: 'secondsWatched must be a non-negative integer' });
  res.json({ ok: true, episodeId: req.params.id, secondsWatched: seconds });
});

app.get('/plans', (_req, res) => res.json([
  { id: 'daily', name: 'Daily', pricePHP: 29, durationDays: 1 },
  { id: 'weekly', name: 'Weekly', pricePHP: 99, durationDays: 7 },
  { id: 'monthly', name: 'Monthly', pricePHP: 249, durationDays: 30 }
]));

app.post('/subscriptions/checkout', auth, (req, res) => {
  const plan = ['daily', 'weekly', 'monthly'].includes(req.body?.plan) ? req.body.plan : null;
  if (!plan) return res.status(400).json({ error: 'Invalid plan' });
  return res.status(501).json({ error: 'Payment provider not configured', plan });
});

app.post('/payments/webhook', (_req, res) => res.status(501).json({ error: 'Payment webhook provider not configured' }));

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => console.log(`TagalogDrama API listening on ${PORT}`));
