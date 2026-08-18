# TagalogDrama API

Express API for catalog access, authentication, playback gating, progress tracking, and future monetization integrations.

## Local setup

1. Copy `.env.example` to `.env`.
2. Set a strong `JWT_SECRET`.
3. Keep `DEMO_MODE=false` unless intentionally testing demo-only authentication/playback.
4. Set `FRONTEND_ORIGIN` to the exact development frontend origin.
5. Install dependencies with `npm install`.
6. Run with `npm start`.

## Production rules

- Use encrypted deployment secrets for all credentials.
- Keep `DEMO_MODE=false`.
- Configure an exact production `FRONTEND_ORIGIN`.
- Do not expose database, payment, signing, or provider secrets to browser code.
- Payment and rewarded-ad endpoints must remain disabled until provider verification is implemented.
- Premium playback must use server-side entitlement checks and short-lived authorization.

## Architecture

- Authentication: managed auth provider or secure server-side auth
- Database: PostgreSQL
- Video: licensed CDN/object storage with signed playback URLs
- Payments: provider with verified webhooks
- Ads: rewarded-ad SDK with server-side reward verification
