# QA smoke test

Run this checklist on every release candidate.

## Core
- [ ] App opens without a fatal error.
- [ ] Home/catalog renders correctly.
- [ ] Search returns expected results.
- [ ] Series and episode detail pages load.
- [ ] Watch flow handles available content correctly.
- [ ] Navigation works on mobile and desktop.

## PWA
- [ ] Manifest is valid.
- [ ] Service worker registers.
- [ ] Cached shell loads after an online visit.
- [ ] New deployment updates the cache correctly.

## Security/release gates
- [ ] No secrets appear in browser source or repository.
- [ ] Unlicensed/demo content remains blocked from production.
- [ ] Premium access is not granted by client-side flags.
- [ ] Protected media is not exposed through permanent private URLs.
- [ ] Payment and ad features remain disabled unless their backend verification is complete.

## Result

PASS / FAIL / BLOCKED
