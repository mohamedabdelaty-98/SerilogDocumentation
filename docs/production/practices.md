# Structured logging and production practices

## Choose levels consistently

Use Debug/Verbose for detailed investigation, Information for expected business or lifecycle milestones, Warning for recoverable anomalies, Error for failed operations, and Fatal for a process or critical component unable to continue. Reserve alerts for actionable conditions; an Error event is not automatically an incident.

## Exception logging

Pass exceptions in the exception parameter, include identifiers as structured properties, and log at the layer that can add useful context. Avoid duplicate stack traces at every rethrow. Preserve the exception when rethrowing with `throw;` in C#.

## Production readiness checklist

- Production level and framework overrides are reviewed.
- Request logs are useful and do not include secrets or excessive query data.
- Service, environment, version, and correlation fields are consistent.
- Sink outage and process shutdown behavior are understood.
- Disk, network, ingestion volume, and retention costs are monitored.
- A real event has been inspected in each destination, including an exception and a request completion event.
- Log access and secret rotation follow team policy.

Use [Configuration best practices](../configuration/best-practices.md) and [Performance and reliability](performance.md) to turn these into team-specific defaults.
