# Log events, templates, and levels

## Logging methods

Serilog exposes `Verbose`, `Debug`, `Information`, `Warning`, `Error`, and `Fatal` methods on `ILogger` and the static `Log` facade. Use the level that conveys the operational significance of the event. Levels are ordered from most detailed to most severe.

```csharp
logger.Verbose("Parsing token at offset {Offset}", offset);
logger.Debug("Cache lookup for {CacheKey}", cacheKey);
logger.Information("Order {OrderId} accepted", orderId);
logger.Warning("Retry {Attempt} scheduled for {Operation}", attempt, operation);
logger.Error("Payment {PaymentId} failed with {Reason}", paymentId, reason);
logger.Fatal(exception, "Worker {WorkerName} cannot continue", workerName);
```

Verbose/Debug are detailed diagnostics, Information records normal milestones, Warning indicates an unexpected but handled condition, Error indicates a failed operation, and Fatal indicates the process or critical component cannot continue. These are conventions: align them with team alerting and retention policies.

## Message templates and named properties

```csharp
logger.Information("Order {OrderId} accepted for {CustomerId}", orderId, customerId);
logger.Information("Payment of {Amount:0.00} {Currency} captured", amount, currency);
```

Each placeholder binds to an argument, left to right for named templates. Property names should be stable and meaningful. Templates are event identity; avoid changing them based on values. Do not concatenate or interpolate dynamic values into the template.

## Logging exceptions

Pass the exception in the dedicated overload so sinks can retain exception type, message, and stack details:

```csharp
try
{
    await paymentGateway.CaptureAsync(paymentId, cancellationToken);
}
catch (PaymentGatewayException ex)
{
    logger.Error(ex, "Capture failed for {PaymentId}", paymentId);
    throw;
}
```

The exception is preserved as event exception data; `{Exception}` can render it in text output. Include operation identifiers as properties, and avoid logging the same exception at every layer unless each layer adds useful context.

Reference: [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).
