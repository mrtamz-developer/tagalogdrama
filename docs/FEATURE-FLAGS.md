# Feature flags

Keep production-risk features disabled until their complete backend and release gates are satisfied.

| Feature | Default | Enable when |
|---|---|---|
| Payments | OFF | Backend, provider integration, webhook verification, and QA are complete |
| Premium entitlements | OFF | Server-side authorization is live and tested |
| Rewarded ads | OFF | Provider SDK and server-side reward validation are complete |
| Protected video | OFF | Signed/expiring playback authorization is live |
| Production catalog | OFF | Rights register is fully verified |
| Analytics | OFF | Privacy review and required disclosures are complete |

Frontend flags are UX controls only. They must never be treated as security authorization.
