# Operations checklist

## Before each release

- [ ] Review `docs/LAUNCH-BLOCKERS.md`.
- [ ] Run `docs/QA-MATRIX.md`.
- [ ] Verify content rights.
- [ ] Confirm no production secrets are committed.
- [ ] Confirm deferred services remain disabled unless fully configured.

## After deployment

- [ ] Open the production URL over HTTPS.
- [ ] Test navigation and catalog pages.
- [ ] Test PWA installation and offline fallback.
- [ ] Check browser console for blocking errors.
- [ ] Confirm the current service worker is active.
- [ ] Monitor errors and availability.

## Incident response

If a critical issue is discovered, disable the affected feature, preserve relevant logs, investigate the cause, and deploy a verified fix before re-enabling it.
