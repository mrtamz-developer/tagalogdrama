# Monitoring readiness

Before production launch, establish enough monitoring to detect failures quickly.

- [ ] Frontend error reporting is configured.
- [ ] Backend/API health checks are configured.
- [ ] Database health and capacity are monitored.
- [ ] Authentication failures are observable without logging passwords or tokens.
- [ ] Payment webhook failures are tracked when payments are enabled.
- [ ] Video playback/authorization failures are measurable.
- [ ] Critical availability alerts have an owner.
- [ ] Logs have retention and access controls.
- [ ] Alerts are tested before launch.
- [ ] Incident-response procedure is documented.

Avoid collecting unnecessary personal information in telemetry.
