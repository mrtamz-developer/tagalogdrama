# Environment and secrets policy

The current static frontend does not require production secrets.

When backend services are added, keep secrets outside the repository and inject them through the deployment platform's secret/environment-variable store.

Never commit:

- Payment secret keys
- API tokens
- Database passwords
- JWT/session signing secrets
- Ad-network private credentials
- Cloud storage private keys

Public configuration may contain non-sensitive values such as API base URLs and feature flags. Any value that grants privileged access must remain server-side.
