# Backend readiness checklist

Before connecting real users, subscriptions, payments, ads, or protected video, implement and test the backend boundary.

- [ ] Authentication and secure session handling
- [ ] User/profile storage
- [ ] Server-side authorization and roles
- [ ] Subscription/entitlement service
- [ ] Protected video authorization with expiring access
- [ ] Payment webhook verification and idempotency
- [ ] Rewarded-ad verification
- [ ] Input validation and rate limiting
- [ ] Audit logging without sensitive data
- [ ] Database backups and recovery plan
- [ ] Monitoring and error reporting
- [ ] Production environment secrets configured outside Git

Do not rely on frontend flags, hidden buttons, or client-side storage as proof of payment or premium entitlement.

PayMongo integration remains deferred until this backend foundation is ready.
