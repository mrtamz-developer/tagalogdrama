# TagalogDrama

A mobile-first Filipino short-drama streaming platform foundation.

## Current features

- Responsive streaming-style home page
- Series catalog and discovery search
- Genre filters
- Episode browser
- Watch page foundation
- Local continue-watching progress
- Local favorites and My Library
- Account/profile foundation
- Admin/content-management foundation
- PWA manifest and offline service worker
- GitHub Pages deployment workflow
- Continuous validation workflow
- Backend API contract and PostgreSQL/Supabase schemas
- Subscription architecture prepared for a future payment provider

## Run locally

This is a static frontend and can be served by any static web server. Do not open the pages only through `file://` when testing the service worker.

Example:

```bash
python -m http.server 8080
```

Then open `http://localhost:8080/`.

## Production requirements still to connect

1. Managed authentication and database project
2. Licensed video storage/CDN with signed playback URLs
3. Rewarded-ad SDK/provider
4. Production payment provider and verified webhooks
5. Authenticated admin API
6. Android/iOS native packaging and store signing

## Content and legal

Only upload, stream, or monetize video, artwork, music, logos, and metadata that you own or have permission/licensing to distribute. Placeholder titles in this repository are development data.

## Security

Never commit `.env` files, private API keys, service-role keys, payment secrets, database passwords, or permanent private video URLs. Premium access must be verified server-side.
