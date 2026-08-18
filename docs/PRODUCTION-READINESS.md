# Production readiness

## Current state

TagalogDrama is in staged-development mode. The public frontend and PWA foundation are being prepared, while production services remain disabled.

## Ready for continued development

- Frontend navigation and catalog foundation
- Favorites and local watch-state foundation
- Versioned service-worker caching and offline fallback
- Subscription configuration without payment processing
- Rewarded-ad configuration without a live ad provider
- Privacy and analytics configuration foundations
- Content-rights and release checklists

## Required before accepting real users/payments

1. Verify every published title and media asset is owned or licensed.
2. Add a production backend for authentication and user entitlements.
3. Add protected video delivery and authorization checks.
4. Integrate payments and verify provider webhooks server-side.
5. Integrate rewarded ads and verify rewards server-side.
6. Publish final privacy/terms disclosures and configure consent where required.
7. Run security, mobile, PWA, and network-failure testing.
8. Keep all production secrets out of the public repository.

Do not enable payment, authentication, or production-video feature flags merely because the frontend controls exist; the corresponding backend protections must be operational first.
