# Database readiness

When the backend is enabled, use a managed PostgreSQL database or equivalent trusted service.

## Required data areas

- Users and profiles
- Roles/administrators
- Series and episodes
- Media metadata
- Watch progress
- Favorites/library
- Subscriptions and entitlements
- Payment transaction references
- Ad reward records
- Audit events

## Rules

- Never store raw payment credentials or card details in the application database.
- Use stable IDs and timestamps for auditable records.
- Enforce authorization in the backend for every protected operation.
- Add indexes for common catalog, user, and entitlement queries.
- Configure backups and a tested recovery procedure before production.
- Keep development/test data separate from production data.
