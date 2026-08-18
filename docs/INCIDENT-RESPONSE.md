# Incident response

## 1. Detect

Record the affected feature, approximate start time, symptoms, and available logs without copying secrets or sensitive user data.

## 2. Contain

Disable the affected feature or endpoint when necessary. For compromised credentials, revoke and rotate them immediately.

## 3. Investigate

Identify the affected deployment/commit, determine the likely cause, and preserve relevant evidence. Do not modify evidence unnecessarily.

## 4. Recover

Deploy a verified fix, restore from a known-good backup when required, and validate data integrity and access controls.

## 5. Verify

Confirm the affected service works normally and that the original failure cannot be reproduced.

## 6. Review

Document the root cause, impact, corrective actions, and prevention steps. Update tests or release gates where appropriate.

### Security incidents

Never publish credentials, tokens, private URLs, or personal data in issues or commits. Rotate exposed secrets and use private security-reporting channels where available.
