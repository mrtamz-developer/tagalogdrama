# Rewarded ads

Rewarded-ad unlocking is intentionally fail-closed until a real ad provider is configured.

## Production flow

1. User signs in.
2. Client requests an ad reward session from the backend.
3. Client shows the provider's rewarded ad.
4. Provider verifies the completed reward server-side.
5. Backend validates the provider callback/signature and idempotency key.
6. Backend grants a short-lived episode entitlement.
7. Client requests protected playback using that entitlement.

The browser must never be trusted to declare that an ad was watched. A local flag, button click, or client-side callback alone must not unlock premium content.
