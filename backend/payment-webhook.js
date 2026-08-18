import pg from 'pg';
import { PLANS } from './paymongo.js';

const { Pool } = pg;
let pool;

function getPool() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required for payment fulfillment');
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 5 });
  return pool;
}

export async function fulfillPayMongoCheckoutPaid(payload) {
  const eventId = payload?.data?.id;
  const attrs = payload?.data?.attributes;
  const session = attrs?.data;
  const sessionAttrs = session?.attributes;
  const metadata = sessionAttrs?.metadata || {};
  const userId = metadata.user_id;
  const plan = metadata.plan;
  const payment = Array.isArray(sessionAttrs?.payments) ? sessionAttrs.payments.find(p => p?.attributes?.status === 'paid') : null;
  const paymentAttrs = payment?.attributes;
  const checkoutSessionId = session?.id;
  const paymentId = payment?.id;

  if (!eventId || !checkoutSessionId || !userId || !plan || !PLANS[plan]) {
    throw new Error('PayMongo webhook is missing required entitlement metadata');
  }
  if (!paymentId || paymentAttrs?.status !== 'paid') throw new Error('No paid PayMongo payment found');
  if (paymentAttrs.currency !== 'PHP' || Number(paymentAttrs.amount) !== PLANS[plan].amount) {
    throw new Error('PayMongo payment amount or currency does not match the selected plan');
  }

  const client = await getPool().connect();
  try {
    await client.query('BEGIN');

    const eventResult = await client.query(
      `insert into public.payment_webhook_events (provider, event_id, event_type, livemode, status, payload)
       values ($1, $2, $3, $4, 'processing', $5::jsonb)
       on conflict (provider, event_id) do nothing
       returning id`,
      ['paymongo', eventId, attrs?.type || 'checkout_session.payment.paid', Boolean(attrs?.livemode), JSON.stringify(payload)]
    );

    if (eventResult.rowCount === 0) {
      await client.query('ROLLBACK');
      return { duplicate: true, eventId };
    }

    const startsAt = new Date();
    const expiresAt = new Date(startsAt.getTime() + PLANS[plan].durationDays * 86400000);

    await client.query(
      `insert into public.payments
        (provider, user_id, checkout_session_id, payment_id, reference_number, plan, amount, currency, livemode, status, paid_at, metadata)
       values ($1,$2,$3,$4,$5,$6,$7,$8,$9,'paid',$10,$11::jsonb)
       on conflict (provider, payment_id) do update
       set status='paid', paid_at=excluded.paid_at, metadata=excluded.metadata`,
      ['paymongo', userId, checkoutSessionId, paymentId, sessionAttrs?.reference_number || null, plan,
       Number(paymentAttrs.amount), paymentAttrs.currency, Boolean(attrs?.livemode), startsAt, JSON.stringify(metadata)]
    );

    await client.query(
      `insert into public.subscriptions
        (user_id, plan, status, provider, provider_subscription_id, provider_checkout_session_id, starts_at, expires_at)
       values ($1,$2,'active','paymongo',$3,$4,$5,$6)
       on conflict (provider_checkout_session_id) do update
       set status='active', starts_at=excluded.starts_at, expires_at=excluded.expires_at`,
      [userId, plan, paymentId, checkoutSessionId, startsAt, expiresAt]
    );

    await client.query(
      `update public.payment_webhook_events
       set status='processed', processed_at=now()
       where provider='paymongo' and event_id=$1`,
      [eventId]
    );

    await client.query('COMMIT');
    return { duplicate: false, eventId, checkoutSessionId, paymentId, plan, expiresAt };
  } catch (error) {
    await client.query('ROLLBACK').catch(() => {});
    throw error;
  } finally {
    client.release();
  }
}
