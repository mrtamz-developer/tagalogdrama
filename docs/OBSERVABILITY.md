# Production observability

Before public launch, configure:

- Structured application logs without passwords, tokens, payment secrets, or unnecessary personal data.
- Error tracking for API and frontend failures.
- Health checks for the API and database.
- Alerts for repeated 5xx responses, webhook failures, authentication failures, and elevated 429 responses.
- Monitoring for payment entitlement mismatches.
- Monitoring for failed rewarded-ad verification.
- Backup and restore verification for the production database.

Operational dashboards should distinguish development/demo traffic from production traffic.
