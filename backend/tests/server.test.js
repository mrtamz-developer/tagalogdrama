import test from 'node:test';
import assert from 'node:assert/strict';

const base = `http://127.0.0.1:${process.env.PORT || 8080}`;

async function get(path, options = {}) {
  return fetch(`${base}${path}`, options);
}

test('health endpoint reports API availability', async () => {
  const response = await get('/health');
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
});

test('protected profile endpoint rejects anonymous access', async () => {
  const response = await get('/me');
  assert.equal(response.status, 401);
});

test('subscription checkout rejects anonymous access', async () => {
  const response = await get('/subscriptions/checkout', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ plan: 'daily' }) });
  assert.equal(response.status, 401);
});

test('reward unlock rejects anonymous access', async () => {
  const response = await get('/episodes/example/unlock-ad', { method: 'POST' });
  assert.equal(response.status, 401);
});
