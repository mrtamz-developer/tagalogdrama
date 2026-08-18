# Subscription products

| Product | Price | Access period | Status |
|---|---:|---:|---|
| Daily | PHP 29 | 24 hours | Planned |
| Weekly | PHP 99 | 7 days | Planned |
| Monthly | PHP 249 | 30 days | Planned |

## Rules

- Product IDs must be created in the real payment provider before checkout is enabled.
- The server, not the browser, determines entitlement expiration.
- Prices displayed by the client must match the provider configuration.
- A successful checkout is not an entitlement until the provider webhook is verified.
- Refunds, chargebacks, cancellations, and expiration must update server-side access.
