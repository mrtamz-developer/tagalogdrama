# Production gate

A release is **not production-ready** until every required gate below is satisfied.

## Current architecture gates

- [ ] Replace demo email-only authentication with real authentication.
- [ ] Persist users, watch progress, rewards, subscriptions, and entitlements in the production database.
- [ ] Replace demo playback URLs with private storage/CDN and short-lived authorization.
- [ ] Verify rewarded-ad callbacks server-side before granting unlocks.
- [ ] Implement payment checkout and cryptographically verified webhooks before enabling subscriptions.
- [ ] Enforce premium entitlement checks server-side.
- [ ] Configure production CORS to an explicit allowlist.
- [ ] Add rate limiting to authentication, rewards, playback, and payment endpoints.
- [ ] Add automated backend tests and CI.
- [ ] Verify all production catalog assets have documented rights.

## Release gates

- [ ] QA smoke test passes.
- [ ] Security checklist passes.
- [ ] Privacy release check passes.
- [ ] Monitoring and recovery procedures are ready.
- [ ] No production secrets are present in Git.
- [ ] Production feature flags are reviewed.

Until these gates pass, payment, premium, rewarded-ad, and protected-video features must remain in demo/deferred state.
