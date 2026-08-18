# Monetization release gate

Before enabling Daily, Weekly, or Monthly subscriptions or rewarded-ad unlocking in production:

- [ ] Payment provider account is configured.
- [ ] Checkout creates orders server-side.
- [ ] Webhooks authenticate provider signatures.
- [ ] Webhooks are idempotent.
- [ ] Successful payment creates a server-side entitlement.
- [ ] Expired/cancelled/refunded subscriptions revoke or expire access.
- [ ] Client-side flags cannot create premium access.
- [ ] Rewarded ads are verified server-side before granting an entitlement/reward.
- [ ] Abuse/rate limits are enabled.
- [ ] Refund and cancellation policies are published.
- [ ] Pricing and currency shown in the app match the configured products.
- [ ] Production test purchase and refund have been completed.

Until all applicable checks pass, monetization endpoints should remain disabled rather than pretending a payment or ad reward succeeded.
