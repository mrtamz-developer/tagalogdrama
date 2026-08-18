# Implementation status

## Working foundation

- Express backend with Helmet and restricted CORS
- JWT authentication middleware
- Demo authentication explicitly disabled unless `DEMO_MODE=true`
- Catalog endpoints
- Episode lookup
- Watch-progress validation
- Subscription plan definitions
- Payment and rewarded-ad endpoints safely disabled until real providers are configured
- Backend smoke/security tests
- GitHub Actions backend CI
- Environment templates and secret protection

## Not yet production-ready

- Real authentication provider
- Persistent user database
- Server-side subscription entitlement storage
- Verified payment webhooks
- Rewarded-ad verification
- Signed production video playback
- Licensed production catalog/media
- Production monitoring, backups, and incident response

The current backend intentionally fails closed for the production-sensitive features above.
