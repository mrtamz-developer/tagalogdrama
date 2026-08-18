# CI/CD

Every backend change should pass the automated test workflow before release.

## Required checks

- Install dependencies successfully.
- Run `npm test`.
- Verify the health endpoint test passes.
- Verify payment/webhook safety tests pass.
- Review production configuration before deployment.

## Release rule

Do not enable payments, rewarded ads, premium entitlements, or protected production video merely because CI passes. Those features also require provider configuration, rights verification, security review, and production smoke testing.
