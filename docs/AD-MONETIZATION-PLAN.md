# Ad monetization plan

## Goal

Allow users to watch eligible free content while offering an optional rewarded-ad path to unlock additional viewing.

## Production requirements

- [ ] Select a supported ad provider/SDK.
- [ ] Review the provider's current platform and policy requirements.
- [ ] Add required privacy/consent disclosures.
- [ ] Keep ad provider identifiers/configuration out of secrets and private credentials out of the frontend.
- [ ] Validate rewarded-ad completion server-side before granting a reward.
- [ ] Prevent replay, duplicate, or fabricated reward callbacks.
- [ ] Define reward duration/episode limits.
- [ ] Add frequency caps and abuse controls.
- [ ] Record only the minimum data required for fraud prevention and reporting.

## Important

A client-side `rewarded` event must not by itself grant permanent premium access. The backend should validate the provider event and issue a limited entitlement.

Keep this feature disabled until the provider, privacy review, and server-side validation are complete.
