import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL || 'http://localhost:8080';

async function request(path, options) {
  return fetch(`${base}${path}`, options);
}

test('protected profile rejects unauthenticated access', async () => {
  const response = await request('/me');
  assert.equal(response.status, 401);
});

test('demo login is disabled in CI/production configuration', async () => {
  const response = await request('/auth/login', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email: 'test@example.com' })
  });
  assert.equal(response.status, 503);
});

test('reward endpoint cannot grant an entitlement without authentication', async () => {
  const response = await request('/episodes/example/unlock-ad', { method: 'POST' });
  assert.equal(response.status, 401);
});

test('payment checkout requires authentication', async () => {
  const response = await request('/subscriptions/checkout', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ plan: 'monthly' })
  });
  assert.equal(response.status, 401);
});
