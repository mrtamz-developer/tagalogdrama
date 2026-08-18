# Security checklist

## Application

- [ ] HTTPS is enforced in production.
- [ ] Authentication and authorization are server-side.
- [ ] Admin endpoints require explicit roles.
- [ ] Protected playback requires valid, short-lived authorization.
- [ ] Inputs are validated and safely handled.
- [ ] Rate limiting is enabled for authentication, rewards, and sensitive endpoints.
- [ ] CORS and security headers are configured appropriately.

## Secrets

- [ ] No API secrets, private keys, tokens, or passwords are committed.
- [ ] Production secrets are stored in encrypted environment/secret management.
- [ ] Exposed credentials are revoked and rotated.

## Monetization

- [ ] Payment webhooks are authenticated and idempotent.
- [ ] Ad rewards are verified server-side.
- [ ] Premium entitlements cannot be granted by client-side flags.

## Content

- [ ] Every production asset has verified rights.
- [ ] Private media origins and storage credentials are protected.
- [ ] Demo/unlicensed assets cannot accidentally enter the production catalog.

## Operational

- [ ] Backups are configured and restoration has been tested.
- [ ] Security incidents have an owner and response procedure.
- [ ] Monitoring does not unnecessarily collect sensitive personal information.
