import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyWebhookSignature } from '../paymongo.js';

function sign(rawBody, timestamp, secret) {
  return crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
}

test('accepts a valid test-mode webhook signature', () => {
  const secret = 'test-webhook-secret';
  const rawBody = '{"data":{"id":"evt_test","attributes":{"livemode":false}}}';
  const timestamp = '1760000000';
  const signature = `t=${timestamp},te=${sign(rawBody, timestamp, secret)},li=`;
  assert.equal(verifyWebhookSignature(rawBody, signature, secret, false), true);
});

test('accepts a valid live-mode webhook signature', () => {
  const secret = 'live-webhook-secret';
  const rawBody = '{"data":{"id":"evt_live","attributes":{"livemode":true}}}';
  const timestamp = '1760000001';
  const signature = `t=${timestamp},te=,li=${sign(rawBody, timestamp, secret)}`;
  assert.equal(verifyWebhookSignature(rawBody, signature, secret, true), true);
});

test('rejects a forged signature', () => {
  const secret = 'webhook-secret';
  const rawBody = '{"data":{"id":"evt_forged"}}';
  const signature = 't=1760000002,te=not-a-real-signature,li=';
  assert.equal(verifyWebhookSignature(rawBody, signature, secret, false), false);
});

test('rejects a modified raw body', () => {
  const secret = 'webhook-secret';
  const original = '{"data":{"id":"evt_original"}}';
  const modified = '{"data":{"id":"evt_modified"}}';
  const timestamp = '1760000003';
  const signature = `t=${timestamp},te=${sign(original, timestamp, secret)},li=`;
  assert.equal(verifyWebhookSignature(modified, signature, secret, false), false);
});
