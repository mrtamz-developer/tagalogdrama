# Security release check

Use this checklist before enabling production services or publishing a release.

- [ ] No `.env`, credentials, API secrets, payment secrets, database passwords, or private signing keys are committed.
- [ ] Privileged API operations require authenticated server-side authorization.
- [ ] Premium/subscription status is determined server-side.
- [ ] Payment webhooks are authenticated, validated, and idempotent.
- [ ] Ad rewards cannot be granted solely from a client-side callback.
- [ ] Video URLs are protected and do not expose permanent private origins.
- [ ] Administrative endpoints require appropriate authorization.
- [ ] User input is validated and output is safely rendered.
- [ ] Production HTTPS is enforced.
- [ ] Dependency and browser security checks have been reviewed.
- [ ] A backup/recovery procedure exists for production data.
- [ ] Critical findings from security testing are resolved.

If any required item fails, keep the affected production feature disabled.
