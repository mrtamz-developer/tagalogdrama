# Security release check

Before enabling real accounts, payments, ads, or production video:

- [ ] No API keys, tokens, passwords, private URLs, or signing credentials are committed.
- [ ] Authentication is handled server-side with secure sessions/tokens and rate limits.
- [ ] Payment webhooks are authenticated and idempotent.
- [ ] Subscription entitlements are calculated server-side.
- [ ] Rewarded-ad rewards are verified server-side.
- [ ] Production video URLs cannot be freely enumerated or reused outside authorized playback.
- [ ] Administrative endpoints require authorization and audit logging.
- [ ] User data deletion/export requirements are implemented where applicable.
- [ ] Dependency and repository security alerts have been reviewed.
- [ ] A production backup and incident-response procedure exists.

Do not switch production feature flags on until these checks are complete.
