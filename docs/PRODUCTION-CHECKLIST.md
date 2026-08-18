# Production launch checklist

## Content
- [ ] Every episode and artwork is owned or licensed.
- [ ] Video URLs are private/signed where required.
- [ ] Subtitles and audio have distribution permission.

## Accounts
- [ ] Production authentication provider configured.
- [ ] Secure sessions and token rotation configured.
- [ ] Account deletion implemented.
- [ ] Privacy policy and terms published.

## Monetization
- [ ] Daily ₱29 product configured.
- [ ] Weekly ₱99 product configured.
- [ ] Monthly ₱249 product configured.
- [ ] Server-side checkout enabled.
- [ ] Signed webhooks verified and idempotent.
- [ ] Refund/cancellation lifecycle tested.
- [ ] Rewarded-ad provider configured and server verification tested.

## Playback
- [ ] Premium entitlement checked server-side.
- [ ] Reward entitlement expires correctly.
- [ ] Playback URLs cannot be guessed or reused after expiration.
- [ ] Watch progress is persisted safely.

## Operations
- [ ] CI is green.
- [ ] Production secrets are outside the repository.
- [ ] Monitoring and error logging enabled.
- [ ] Database backups configured.
- [ ] Rate limiting and abuse controls enabled.
- [ ] Final mobile QA completed.
