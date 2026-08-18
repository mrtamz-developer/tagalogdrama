# Provider integration checklist

## Payments
- [ ] Create Daily product at PHP 29.
- [ ] Create Weekly product at PHP 99.
- [ ] Create Monthly product at PHP 249.
- [ ] Store provider product/plan IDs in deployment secrets.
- [ ] Configure webhook endpoint over HTTPS.
- [ ] Verify webhook signatures server-side.
- [ ] Make webhook processing idempotent.
- [ ] Test successful payment, expiry, cancellation, and refund.

## Rewarded ads
- [ ] Create production ad placement.
- [ ] Configure server-side reward verification.
- [ ] Validate provider callback/signature.
- [ ] Make reward grants idempotent.
- [ ] Test duplicate and forged reward callbacks.

## Video
- [ ] Upload only licensed media.
- [ ] Configure private/signed playback URLs.
- [ ] Enforce entitlement before issuing playback authorization.
- [ ] Test expired and revoked access.
