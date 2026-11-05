# Contextual logging and correlation IDs

Ambient context adds properties to events within a bounded operation. `LogContext` requires `.Enrich.FromLogContext()` when creating the logger. Push properties with `using` so they are removed when the scope ends.

```csharp
using Serilog.Context;

using (LogContext.PushProperty("CorrelationId", correlationId))
using (LogContext.PushProperty("TenantId", tenantId))
{
    logger.Information("Processing batch {BatchId}", batchId);
    await ProcessBatchAsync(batchId, cancellationToken);
}
```

The properties apply to log events written inside the scope, including across async calls when execution context flows normally. Do not retain the returned disposable beyond the intended scope. Avoid high-cardinality or sensitive values unless the destination and policy support them.

For HTTP correlation, prefer established request/trace identifiers from ASP.NET Core's activity and diagnostic context where suitable. A correlation ID should be validated, propagated across service boundaries, and included consistently; it is not an authorization token. Avoid trusting arbitrary incoming identifiers without length/format limits.

Packages: `Serilog` and the relevant ASP.NET integration package. See [Enrichment and LogContext](https://github.com/serilog/serilog/wiki/Enrichment#the-logcontext).
