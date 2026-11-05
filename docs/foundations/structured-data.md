# Structured data, properties, and destructuring

Properties are the named values bound from templates or added through enrichment. Serilog has sink-independent representations for scalars, sequences, and structures. Sinks may serialize these differently, so verify the shape in the target system.

```csharp
logger.Information("Found {Count} records for {CustomerId}", count, customerId);
logger.Information("Tags for {CustomerId}: {@Tags}", customerId, tags);
logger.Information("Order {@Order}", safeOrderSummary);
logger.Information("Account {Account}", accountNumber); // scalar as a property
```

The `@` operator asks Serilog to destructure an object into structured properties. Without `@`, complex values are generally represented as scalar/string values according to Serilog's policies. `$` explicitly requests stringification. Destructuring depth, string length, and collection size can affect cost and event size. Do not destructure ORM entities, request bodies, credentials, or unbounded graphs indiscriminately.

Prefer a safe projection:

```csharp
var summary = new { order.Id, order.Status, ItemCount = order.Items.Count };
logger.Information("Order snapshot {@Order}", summary);
```

This makes the intended event schema explicit and avoids exposing irrelevant fields. Custom destructuring policies are possible; see [Enrichers and policies](../pipeline/enrichers.md).

Reference: [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data).
