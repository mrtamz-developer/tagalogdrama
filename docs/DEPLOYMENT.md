# Deployment guide

## GitHub Pages

1. Open **Settings → Pages** in the repository.
2. Set the source to **Deploy from a branch**.
3. Select `main` and `/ (root)`.
4. Save and wait for the Pages deployment.

## Before production

- Confirm the deployed URL loads over HTTPS.
- Confirm `manifest.json` and `service-worker.js` load successfully.
- Confirm the service worker scope matches the deployed path.
- Test Home, Series, Search, Library, Account, Episodes, Watch, Privacy, Terms, and Status pages.
- Keep payments, authentication, real ads, and production video disabled until their server-side services are implemented and security-reviewed.

## GitHub Pages path note

If the site is deployed under a repository subpath, all relative asset URLs should remain relative (`./...`) so the app works from that path.
