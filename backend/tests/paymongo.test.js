import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import { verifyWebhookSignature, PLANS } from '../paymongo.js';

function signature(rawBody, secret, mode = 'test') {
  const timestamp = String(Math.floor(Date.now() / 1000));
  const digest = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  return `t=${timestamp},te=${mode === 'test' ? digest : ''},li=${mode === 'live' ? digest : ''}`;
}

test('PayMongo plan amounts are PHP 29, PHP 99 and PHP 249', () => {
  assert.equal(PLANS.daily.amount, 2900);
  assert.equal(PLANS.weekly.amount, 9900);
  assert.equal(PLANS.monthly.amount, 24900);
});

test('accepts a valid test-mode webhook signature', () => {
  const body = JSON.stringify({ data: { id: 'evt_test' } });
  const secret = 'test-webhook-secret';
  assert.equal(verifyWebhookSignature(body, signature(body, secret, 'test'), secret, false), true);
});

test('accepts a valid live-mode webhook signature', () => {
  const body = JSON.stringify({ data: { id: 'evt_live' } });
  const secret = 'live-webhook-secret';
  assert.equal(verifyWebhookSignature(body, signature(body, secret, 'live'), secret, true), true);
});

test('rejects a forged webhook signature', () => {
  const body = JSON.stringify({ data: { id: 'evt_forged' } });
  const secret = 'test-webhook-secret';
  assert.equal(verifyWebhookSignature(body, 't=1,te=bad,li=', secret, false), false);
});

test('rejects a signature generated from a different raw body', () => {
  const secret = 'test-webhook-secret';
  const signedBody = JSON.stringify({ data: { id: 'evt_original' } });
  const receivedBody = JSON.stringify({ data: { id: 'evt_modified' } });
  assert.equal(verifyWebhookSignature(receivedBody, signature(signedBody, secret, 'test'), secret, false), false);
});
