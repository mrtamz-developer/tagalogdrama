# API scaling strategy

The current API uses an in-memory rate limiter, which is suitable for a single process only.

Before running multiple backend instances:

- Move rate-limit counters to a shared Redis-compatible store.
- Move sessions/entitlements to the production database.
- Add a database connection pool and health checks.
- Keep payment webhook idempotency keys in durable storage.
- Use signed/private video delivery from the video provider or CDN.
- Put the API behind HTTPS and a managed load balancer.
- Add centralized logs, metrics, and alerting.

Do not scale horizontally while relying on process-local security state.
