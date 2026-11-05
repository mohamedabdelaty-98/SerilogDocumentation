# Structured logging

Structured logging keeps data as fields attached to an event. It is useful when logs must answer questions, support dashboards, or be joined across services. A log viewer can filter `StatusCode >= 500` or group by `Operation`, while the message remains readable to a developer.

## Four representations to distinguish

```mermaid
flowchart TD
  A["Traditional: logger.Info(\"Order \" + id)"] --> B["One rendered string; field boundaries lost"]
  C["Template: Order {OrderId} accepted"] --> D["Stable template + bound values"]
  D --> E["Structured property: OrderId = 4812"]
  F["Destructure: {@Order}"] --> G["Selected object shape represented as structure"]
```

The first example builds text before logging. The template form keeps a stable event shape. Named properties make individual values queryable. Destructuring requests a structured representation for a complex object; it should be used deliberately because captured shape and size affect storage and privacy.

```csharp
// Avoid: each rendered string can be a different template and the field is lost.
logger.Information($"Order {order.Id} accepted");

// Prefer: OrderId remains a named property.
logger.Information("Order {OrderId} accepted", order.Id);

// Deliberate destructuring: capture the object's selected public shape.
logger.Information("Order snapshot {@Order}", order);
```

Serilog uses `@` to request destructuring and `$` to request stringification in a template. Default handling treats scalar values and collections naturally; complex objects are not automatically expanded as arbitrary object graphs. Prefer explicit, purpose-built logging DTOs for sensitive or large objects.

## Stable templates

Use constant templates, meaningful property names, and values as arguments. Avoid concatenation and interpolation for event data. This supports template caching and consistent grouping. Serilog templates use named placeholders such as `{ElapsedMs}` and support standard formatting hints such as `{Amount:0.00}`.

Reference: [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data), [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).
