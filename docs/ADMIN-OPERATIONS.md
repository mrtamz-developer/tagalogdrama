# Admin operations

## Roles

Use least privilege. Separate content editors from full administrators where practical.

## Content workflow

1. Create draft series.
2. Add episode metadata and media reference.
3. Verify content rights.
4. Run playback and metadata QA.
5. Mark the asset approved.
6. Publish through an authorized server-side operation.

## Administrative safeguards

- [ ] Admin authentication is enabled.
- [ ] Role authorization is enforced server-side.
- [ ] Sensitive actions are audited.
- [ ] Publish/unpublish actions are reversible.
- [ ] Bulk operations require confirmation.
- [ ] Production media cannot be replaced without authorization.
- [ ] Admin credentials are never stored in frontend source.

## Emergency controls

Administrators should have a documented way to disable a problematic title, episode, payment feature, ad reward feature, or protected playback service without redeploying the entire application.
