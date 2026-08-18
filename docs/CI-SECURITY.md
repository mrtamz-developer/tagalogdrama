# CI security policy

- CI may use synthetic secrets only; never production credentials.
- Dependency installation must use the lockfile when one is present.
- Production secrets belong in GitHub Actions/deployment secrets, not source files.
- Security-sensitive tests should fail closed when required configuration is absent.
- CI must run syntax checks and backend tests before release.
