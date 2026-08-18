# Environment configuration

Never commit production secrets to GitHub.

## Backend variables

```text
PORT=8080
JWT_SECRET=<long-random-production-secret>
FRONTEND_ORIGIN=https://your-production-domain.example
DEMO_MODE=false
DATABASE_URL=<managed-database-connection>
PAYMENT_PROVIDER=<provider-name>
PAYMENT_WEBHOOK_SECRET=<provider-webhook-secret>
AD_PROVIDER=<provider-name>
AD_REWARD_SECRET=<provider-server-verification-secret>
VIDEO_SIGNING_SECRET=<video-provider-secret>
```

## Rules

- Use GitHub Actions/environment secrets or the deployment platform's secret manager.
- Use different credentials for development, staging, and production.
- Rotate credentials after accidental exposure.
- Keep `DEMO_MODE=false` in production.
- Keep payments, rewarded ads, and video playback disabled until their provider configuration has been tested.
