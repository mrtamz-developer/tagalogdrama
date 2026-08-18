# Subscription plan

## Intended tiers

The app can support free viewing plus paid subscriptions once the backend and store/payment requirements are ready.

### Free

- Selected episodes/content
- Optional rewarded-ad unlocks
- Basic library and watch progress

### Premium

- Premium catalog access
- Ad-free experience where permitted
- Subscriber-only episodes/features

## Required backend controls

- [ ] Subscription products and prices are defined.
- [ ] Store/payment provider integration is complete.
- [ ] Webhooks/server notifications are verified.
- [ ] Entitlements are stored server-side.
- [ ] Subscription expiry/cancellation is handled.
- [ ] Restore-purchase flow is supported where required.
- [ ] Refund/revocation events update entitlements.
- [ ] Client UI never determines premium access by itself.

## Payment status

Payment integration is intentionally deferred. PayMongo can be added later for supported web checkout flows after the backend security and webhook architecture is ready. Native app-store subscriptions may have separate platform requirements.
