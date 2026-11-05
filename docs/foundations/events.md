# Writing log events

This chapter expands the official [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events) guide. Serilog writes events through the static `Log` facade or through an `ILogger` instance. In application code, prefer the logger provided by dependency injection; `Log` is concise for examples and bootstrap code.

## A call creates an event, not just a line of text

```csharp
var quotaMb = 1024;
var user = "nblumhardt";

logger.Warning("Disk quota {Quota} MB exceeded by {User}", quotaMb, user);
```

The event has Warning level and two properties, `Quota` (an integer) and `User` (a string). A text sink may render a line like:

```text
Disk quota 1024 MB exceeded by "nblumhardt"
```

The string quotes make the type of the `User` value visible in Serilog's text rendering. A structured sink can retain the values as separate typed fields.

## Message template syntax

A message template is stable text with placeholders that capture values:

```csharp
logger.Information("Invoice {InvoiceId} for {Amount:0.00} {Currency}", invoiceId, amount, currency);
```

- Placeholders are enclosed in `{` and `}`.
- Use C# identifier-style names such as `InvoiceId`; names like `Invoice.Id` and `Invoice-Id` are invalid placeholder identifiers.
- Values bind from the supplied arguments. When all placeholders are numeric (`{0}`, `{1}`), indexes work like `string.Format()`. With named placeholders, bind arguments left to right.
- Escape literal braces by doubling them: `{{` and `}}`.
- A format suffix such as `:0.00` controls textual rendering; it does not change the underlying captured numeric value.
- `@` requests destructuring of a complex object; `$` requests stringification. See [Structured Data](structured-data.md).

Prefer PascalCase property names for consistency. Use the property names as part of the message text so a rendered event remains understandable. Short fragments without a trailing full stop are a useful convention for consistency.

## Templates versus preformatted messages

Avoid concatenation and interpolation when the values should be event properties:

```csharp
// Avoid: the logger receives a changing string rather than a stable template.
logger.Information("The time is " + DateTimeOffset.UtcNow);

// Prefer: the template stays constant and Now is queryable as a property.
logger.Information("The time is {Now}", DateTimeOffset.UtcNow);
```

Serilog parses and caches message templates. A different fully formatted string on every call defeats that reuse and prevents a log store from grouping events by a stable template. In performance-sensitive code, the logger checks whether a level is enabled cheaply; only guard expensive diagnostic-value construction when profiling shows the work matters.

## Levels and their meaning

Levels order events by importance, from lower to higher severity:

| Level | Use |
|---|---|
| `Verbose` | Fine-grained tracing and debugging detail, usually enabled only temporarily. |
| `Debug` | Internal state and control flow useful for diagnosing a known problem. |
| `Information` | Events that describe the application's responsibilities and observable work. |
| `Warning` | A possible problem, degradation, or unexpected condition that has not made the operation fail. |
| `Error` | A failure in an operation or connected system. |
| `Fatal` | A critical condition that prevents the application from continuing normally. |

The default minimum level is `Information`; events below the configured threshold are not emitted. Choose levels according to what operators need to know and the cost/volume your destinations can handle. An Information event is often a useful business or operational event, not merely a progress sentence.

```csharp
logger.Verbose("Parsing record {RecordNumber}", recordNumber);
logger.Debug("Cache miss for {CacheKey}", cacheKey);
logger.Information("Order {OrderId} accepted", orderId);
logger.Warning("Retry {Attempt} scheduled for {Operation}", attempt, operation);
logger.Error("Payment failed for {PaymentId}", paymentId);
logger.Fatal(exception, "Worker {WorkerName} cannot continue", workerName);
```

Serilog also supports `IsEnabled()` and `LoggingLevelSwitch` when an application has a specific need for level checks or runtime level changes. Do not add an `IsEnabled()` branch around every log statement; ordinary disabled-level calls are designed to be inexpensive.

## Logging exceptions

Use the overload that accepts an exception so the event retains the exception as exception data:

```csharp
try
{
    await gateway.CaptureAsync(paymentId, cancellationToken);
}
catch (PaymentGatewayException ex)
{
    logger.Error(ex, "Payment capture failed for {PaymentId}", paymentId);
    throw;
}
```

Passing `ex` as an ordinary template argument is not equivalent to the exception parameter. Include useful operation identifiers as named properties. When rethrowing in C#, `throw;` preserves the original stack. Avoid duplicate logging at every layer if an upper layer adds no new diagnostic context.

Reference: [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).
