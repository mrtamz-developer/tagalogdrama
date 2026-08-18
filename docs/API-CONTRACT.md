# Backend API contract

This document defines the minimum server boundary for the streaming app. Exact implementation/provider may change.

## Public/read endpoints

- `GET /api/series` — paginated catalog
- `GET /api/series/:id` — series metadata
- `GET /api/episodes/:id` — episode metadata
- `GET /api/search?q=` — catalog search

## Authenticated endpoints

- `GET /api/me` — current profile
- `GET /api/library` — favorites/watchlist
- `PUT /api/progress/:episodeId` — watch progress
- `POST /api/rewards/verify` — verify an ad reward
- `GET /api/entitlements` — current premium entitlements

## Protected playback

- `POST /api/playback/:episodeId` — server verifies identity and entitlement, then returns a short-lived playback authorization/token.

## Admin endpoints

- `POST /api/admin/series`
- `POST /api/admin/episodes`
- `PUT /api/admin/episodes/:id`
- `POST /api/admin/publish/:id`

All admin endpoints require server-side role authorization.

## Webhooks

- `POST /api/webhooks/payment`
- `POST /api/webhooks/ad-reward`

Webhook handlers must verify authenticity, reject malformed events, and be idempotent.

## Security rules

Never accept client-provided `isPremium`, `paid`, `role`, or `rewarded` flags as proof. Validate all protected state on the server.
