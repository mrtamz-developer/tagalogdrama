import test from 'node:test';
import assert from 'node:assert/strict';

const base = process.env.API_BASE_URL || 'http://localhost:8080';

test('health endpoint', async () => {
  const response = await fetch(`${base}/health`);
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.equal(body.ok, true);
});

test('payment webhook stays disabled until configured', async () => {
  const response = await fetch(`${base}/payments/webhook`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{}'
  });
  assert.equal(response.status, 501);
});
