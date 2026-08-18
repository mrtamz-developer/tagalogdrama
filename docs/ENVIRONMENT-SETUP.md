# Environment setup

## Development

Use local environment variables for backend credentials and provider configuration. Keep `.env` files out of Git.

Example variables:

```text
DATABASE_URL=
AUTH_SECRET=
VIDEO_SIGNING_SECRET=
PAYMENT_SECRET=
PAYMENT_WEBHOOK_SECRET=
AD_PROVIDER_SECRET=
```

The names above are placeholders only. Never commit real values.

## Production

Configure secrets through the deployment platform's encrypted secret/environment-variable system. Rotate credentials if they are exposed or suspected to be compromised.

## Frontend rule

Public frontend configuration may contain only values that are intentionally public. Never expose database passwords, service-role keys, payment secrets, signing secrets, or privileged API credentials in browser JavaScript.
