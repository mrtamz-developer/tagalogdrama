# Backend architecture

This directory documents the production backend contract without storing secrets in Git.

## Recommended production stack

- Authentication: managed auth provider or a secure server-side auth system
- Database: PostgreSQL
- Video: licensed video CDN/object storage with signed playback URLs
- Payments: a Philippine-compatible payment provider with webhook verification
- Ads: rewarded-ad SDK on Android; web implementation depends on the ad network

## Core entities

- users
- subscriptions
- series
- episodes
- watch_progress
- favorites
- ad_unlocks
- payments

## Security

Never put payment secret keys, database passwords, service-role keys, or private video URLs in frontend JavaScript. Subscription status and ad unlocks must be verified server-side.
