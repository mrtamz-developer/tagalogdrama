/**
 * PayMongo server-side adapter.
 * Keep PAYMONGO_SECRET_KEY on the backend only.
 * Subscription capability must be activated on your PayMongo account before live use.
 */

const PAYMONGO_API = 'https://api.paymongo.com/v1';

function authHeader(secret) {
  return 'Basic ' + Buffer.from(`${secret}:`).toString('base64');
}

async function paymongoRequest(path, method, body) {
  const secret = process.env.PAYMONGO_SECRET_KEY;
  if (!secret) throw new Error('PAYMONGO_SECRET_KEY is not configured');

  const response = await fetch(`${PAYMONGO_API}${path}`, {
    method,
    headers: {
      'Authorization': authHeader(secret),
      'Content-Type': 'application/json',
      'Accept': 'application/json'
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

async function createSubscription({ planId, customerId }) {
  return paymongoRequest('/subscriptions', 'POST', {
    data: {
      attributes: {
        plan_id: planId,
        customer_id: customerId
      }
    }
  });
}

async function getSubscription(subscriptionId) {
  return paymongoRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, 'GET');
}

async function cancelSubscription(subscriptionId) {
  return paymongoRequest(`/subscriptions/${encodeURIComponent(subscriptionId)}`, 'DELETE');
}

module.exports = { createSubscription, getSubscription, cancelSubscription };
