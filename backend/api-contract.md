# TagalogDrama API contract

## Authentication
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/logout`
- `GET /me`

## Catalog
- `GET /series`
- `GET /series/:id`
- `GET /series/:id/episodes`

## Playback
- `POST /episodes/:id/unlock-ad`
- `POST /episodes/:id/play`
- `PUT /episodes/:id/progress`

`/play` must verify the user's subscription or a valid server-issued ad unlock before returning a short-lived signed video URL.

## User library
- `GET /me/favorites`
- `POST /me/favorites/:seriesId`
- `DELETE /me/favorites/:seriesId`
- `GET /me/continue-watching`

## Subscriptions
- `GET /plans`
- `POST /subscriptions/checkout`
- `GET /me/subscription`
- `POST /payments/webhook`

Payment webhooks must be authenticated/verified by the payment provider. Never trust a frontend success callback as proof of payment.
