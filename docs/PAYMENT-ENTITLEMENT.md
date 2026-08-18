# Payment entitlement requirements

PayMongo payment success must not grant premium access from the browser redirect alone. PayMongo documents webhooks as the source of truth for payment status and recommends deduplicating webhook event IDs because deliveries can be retried. citeturn0search3turn0search7

## Required durable records

Before production premium access is enabled, persist:

- `webhook_events`: unique provider event ID, event type, livemode, received/processed timestamps, processing status
- `payments`: PayMongo payment/checkout IDs, user ID, plan, amount, currency, status, provider reference
- `subscriptions`: user ID, plan, start/end timestamps, status, provider identifiers

## Fulfillment rules

1. Verify the PayMongo signature against the untouched request body.
2. Reject or ignore events from the wrong environment.
3. Deduplicate by PayMongo event ID.
4. Validate the expected plan/amount/currency against the server-side plan configuration.
5. Record the payment before granting access.
6. Grant premium entitlement transactionally with the payment record.
7. Return a 2xx response for recognized and unrecognized events after authentication so PayMongo does not unnecessarily retry them.
8. Never trust `successUrl` or client-supplied plan/price as proof of payment.

PayMongo requires webhook endpoints to acknowledge deliveries with a 2xx JSON response and may retry failed deliveries up to 12 times. citeturn0search1turn0search6
