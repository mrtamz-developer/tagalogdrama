# Authentication plan

## Production requirements

- [ ] Use a trusted authentication service or securely implemented backend authentication.
- [ ] Support verified email/account identity where required.
- [ ] Use secure, expiring sessions/tokens.
- [ ] Enforce authorization server-side for user, admin, premium, and content operations.
- [ ] Provide logout/session revocation.
- [ ] Define account recovery securely.
- [ ] Rate-limit login and recovery endpoints.
- [ ] Do not log passwords, access tokens, refresh tokens, or recovery secrets.
- [ ] Separate administrator roles from normal users.
- [ ] Review account deletion and personal-data handling before launch.

## Frontend rule

The browser may display authentication state, but it must not be the authority for permissions or premium access.

Keep authentication disabled or limited to development until the backend security controls are implemented and tested.
