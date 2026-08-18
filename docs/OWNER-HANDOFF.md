# TagalogDrama owner handoff

## What is safe to do now

- Review the public frontend and PWA behavior.
- Replace demo catalog data with verified licensed content.
- Run the QA and release checklists.
- Configure deployment settings.

## What is intentionally deferred

- PayMongo/payment processing
- Real authentication
- Production ad SDK
- Protected production video delivery

## Before enabling deferred services

Follow `docs/PRODUCTION-READINESS.md`, `docs/SECURITY-RELEASE-CHECK.md`, and `docs/LAUNCH-BLOCKERS.md`.

Never place private provider credentials in frontend files or commit them to GitHub.
