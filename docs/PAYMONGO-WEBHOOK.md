# PayMongo webhook fulfillment

PayMongo recommends Hosted Checkout v2 for new integrations. A successful hosted checkout emits `checkout_session.payment.paid`; the backend must use that webhook as the payment source of truth rather than trusting the browser redirect. citeturn0search0turn0search3

## Production requirements

1. Configure a public HTTPS webhook endpoint.
2. Subscribe to `checkout_session.payment.paid`.
3. Verify the `Paymongo-Signature` header using the webhook endpoint secret.
4. Process each event idempotently using the PayMongo event ID.
5. Look up the pending checkout by its reference number/session ID.
6. Confirm the paid amount, currency, and plan metadata before granting access.
7. Store the resulting payment and entitlement durably.
8. Return a 2xx response promptly after successful processing.

PayMongo retries failed webhook deliveries, so duplicate-event handling is required. citeturn0search4turn0search11

Do not grant a subscription merely because the customer reaches `success_url`.
