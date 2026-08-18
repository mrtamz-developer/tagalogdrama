/**
 * PayMongo server-side adapter.
 * Keep PAYMONGO_SECRET_KEY on the backend only.
 * Uses PayMongo Hosted Checkout v2 for new integrations.
 */

import crypto from 'node:crypto';

const PAYMONGO_API = 'https://api.paymongo.com/v2';

function authHeader(secret) {
  return 'Basic ' + Buffer.from(`${secret}:`).toString('base64');
}

async function paymongoRequest(path, method, body, { idempotencyKey } = {}) {
  const secret = process.env.PAYMONGO_SECRET_KEY;
  if (!secret) throw new Error('PAYMONGO_SECRET_KEY is not configured');

  const headers = {
    Authorization: authHeader(secret),
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const response = await fetch(`${PAYMONGO_API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.errors?.[0]?.detail || `PayMongo request failed (${response.status})`;
    throw new Error(message);
  }
  return payload;
}

const PLANS = Object.freeze({
  daily: { name: 'TagalogDrama Daily', amount: 2900, durationDays: 1 },
  weekly: { name: 'TagalogDrama Weekly', amount: 9900, durationDays: 7 },
  monthly: { name: 'TagalogDrama Monthly', amount: 24900, durationDays: 30 }
});

export async function createCheckoutSession({ plan, userId, email, successUrl, cancelUrl, idempotencyKey }) {
  const selected = PLANS[plan];
  if (!selected) throw new Error('Invalid subscription plan');
  if (!idempotencyKey) throw new Error('idempotencyKey is required');

  const reference = `TD-${String(userId)}-${Date.now()}`;
  const payload = await paymongoRequest('/checkout_sessions', 'POST', {
    data: {
      attributes: {
        line_items: [{
          name: selected.name,
          amount: selected.amount,
          currency: 'PHP',
          quantity: 1
        }],
        payment_method_types: ['card', 'gcash', 'qrph'],
        success_url: successUrl,
        cancel_url: cancelUrl,
        reference_number: reference,
        send_email_receipt: true,
        metadata: {
          user_id: String(userId),
          plan,
          duration_days: String(selected.durationDays),
          email: String(email || '')
        }
      }
    }
  }, { idempotencyKey });

  return {
    id: payload?.data?.id,
    checkoutUrl: payload?.data?.attributes?.checkout_url,
    referenceNumber: reference,
    plan,
    durationDays: selected.durationDays
  };
}

export function verifyWebhookSignature(rawBody, signatureHeader, secret, livemode) {
  if (!rawBody || !signatureHeader || !secret) return false;
  const parts = Object.fromEntries(
    String(signatureHeader).split(',').map(part => {
      const index = part.indexOf('=');
      return index > 0 ? [part.slice(0, index).trim(), part.slice(index + 1).trim()] : ['', ''];
    }).filter(([key]) => key)
  );
  if (!parts.t) return false;
  const provided = livemode ? parts.li : parts.te;
  if (!provided) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${parts.t}.${rawBody}`).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(provided, 'utf8');
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export { PLANS };
