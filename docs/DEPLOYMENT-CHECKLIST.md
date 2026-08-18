# Deployment checklist

## Pre-deployment

- [ ] `README.md` is current.
- [ ] `docs/FINAL-RELEASE-GATE.md` has been reviewed.
- [ ] Production media rights are verified.
- [ ] No secrets or private credentials are committed.
- [ ] Payment, ad, authentication, and protected-video services are enabled only when their backend controls are ready.
- [ ] PWA service worker and manifest are present.

## Deployment

- [ ] Deploy the intended branch/commit.
- [ ] Confirm HTTPS is active.
- [ ] Confirm the home page loads.
- [ ] Confirm navigation and catalog pages load.
- [ ] Confirm service worker registers without errors.
- [ ] Confirm offline fallback works after an initial online visit.

## Post-deployment

- [ ] Test mobile viewport.
- [ ] Check browser console for critical errors.
- [ ] Verify the deployed revision.
- [ ] Monitor availability and errors.
- [ ] Record any known non-blocking issues.
