# Recovery plan

## Backup

Maintain scheduled backups for production database data and critical configuration. Backups must be stored separately from the primary production environment.

## Recovery priorities

1. Restore database availability.
2. Restore authentication and authorization.
3. Restore catalog and media metadata.
4. Restore protected video authorization.
5. Restore subscriptions/entitlements and verified payment references.
6. Restore non-critical analytics and reporting.

## Recovery requirements

- [ ] Recovery credentials are stored securely outside Git.
- [ ] Backup restoration has been tested.
- [ ] Recovery owner and escalation path are documented.
- [ ] Recovery objectives are defined before launch.
- [ ] Data integrity is checked after restoration.
- [ ] Users are notified when an incident materially affects service or data.

Never treat a Git repository as the only backup of production data.
