# TagalogDrama architecture

## Frontend

- Static HTML pages provide the public UI.
- `style.css` contains presentation rules.
- `app.js` provides catalog rendering and local favorites/toast behavior.
- `app-config.js` and `data/*.json` provide non-secret configuration.

## PWA

- `manifest.json` defines install metadata.
- `service-worker.js` provides versioned caching and offline fallback.
- The canonical service worker is registered from `index.html`.

## Future backend boundary

Authentication, subscription entitlements, payment verification, ad-reward verification, protected video authorization, and administrative operations should be implemented behind a trusted backend. Do not move private credentials into frontend JavaScript.

## Content

Production titles and media must be verified against the content-rights register before publication.
