/**
 * PayMongo server-side adapter.
 * Keep PAYMONGO_SECRET_KEY on the backend only.
 * Uses PayMongo Hosted Checkout v2 for new integrations.
 */

const PAYMONGO_API = 'https://api.paymongo.com/v2';

function authHeader(secret) {
  return 'Basic ' + Buffer.from(`${secret}:`).toString('base64');
}

async function paymongoRequest(path, method, body) {
  const secret = process.env.PAYMONGO_SECRET_KEY;
  if (!secret) throw new Error('PAYMONGO_SECRET_KEY is not configured');

  const response = await fetch(`${PAYMONGO_API}${path}`, {
    method,
    headers: {
      Authorization: authHeader(secret),
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
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

export async function createCheckoutSession({ plan, userId, email, successUrl, cancelUrl }) {
  const selected = PLANS[plan];
  if (!selected) throw new Error('Invalid subscription plan');

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
  });

  return {
    id: payload?.data?.id,
    checkoutUrl: payload?.data?.attributes?.checkout_url,
    referenceNumber: reference,
    plan,
    durationDays: selected.durationDays
  };
}

export { PLANS };
