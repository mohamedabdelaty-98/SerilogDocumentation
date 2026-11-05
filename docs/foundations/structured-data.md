# Structured data, properties, and destructuring

This chapter follows the official [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data) guide. Serilog converts .NET values supplied to log calls into sink-independent property values. A sink then formats or serializes those values for its destination.

## Why representation matters

The same .NET object could be stored as text, a scalar, a sequence, or a structure. That choice affects whether a field can be queried, how much storage it consumes, and the work needed to capture it. Serilog makes useful default choices for common values; use template operators and destructuring configuration when the default representation is not desired.

```csharp
logger.Information("Retrieved {Count} records", 456);
```

The `Count` property is a numeric scalar. A JSON representation is `{ "Count": 456 }`. Scalar values include booleans, common numeric types, strings, byte arrays, date/time values, `Guid`, `Uri`, and nullable forms of these types.

## Collections and dictionaries

An `IEnumerable` value is represented as a sequence of its elements:

```csharp
var fruit = new[] { "Apple", "Pear", "Orange" };
logger.Information("Items in the basket: {Fruit}", fruit);
```

The equivalent JSON shape is `{ "Fruit": ["Apple", "Pear", "Orange"] }`. Serilog also recognizes `Dictionary<TKey,TValue>` when the key type is scalar. An arbitrary type that merely implements `IDictionary<TKey,TValue>` is not necessarily treated as a dictionary by default; where appropriate, configure `Destructure.AsDictionary()` for the specific type.

## Objects and default stringification

For an unfamiliar complex object, Serilog does not automatically walk every property. Without a destructuring instruction or policy, it uses the object's `ToString()` representation. This avoids assuming that every .NET object is safe or meaningful to serialize—for example, a database connection object is not a useful log payload.

```csharp
logger.Information("Connected with {Connection}", connection);
```

To preserve an intentional object shape, use the `@` destructuring operator:

```csharp
var sensorInput = new { Latitude = 25, Longitude = 134 };
logger.Information("Processing {@SensorInput}", sensorInput);
```

The `SensorInput` property is represented as a structure, for example `{ "Latitude": 25, "Longitude": 134 }`. Destructure DTOs and purpose-built summaries rather than arbitrary entities or request objects.

## `@` and `$` operators

The operators apply at capture time and change the stored property representation:

```csharp
logger.Information("Request shape {@RequestSummary}", requestSummary); // structured value
logger.Information("Opaque value {$Payload}", payload);                 // ToString() text
```

`@` asks for structured destructuring. `$` forces the value to a string before other handling. These operators affect what is captured in the event. They differ from a format specifier such as `{Amount:0.00}`, which controls textual display and does not change the stored numeric representation.

## Customize captured object shapes

When only selected members are useful, project the input to a different type before destructuring:

```csharp
var safeSummary = new { request.Method, request.Path, request.ContentLength };
logger.Information("Received request {@Request}", safeSummary);
```

Configuration can also transform a type with `Destructure.ByTransforming<T>()` or a custom `IDestructuringPolicy`:

```csharp
var logger = new LoggerConfiguration()
    .Destructure.ByTransforming<HttpRequest>(request => new
    {
        request.Method,
        Path = request.Path.Value
    })
    .WriteTo.Console()
    .CreateLogger();
```

The transform must return a different type from its input. Returning the same type can recursively invoke the transformation. Implement `IDestructuringPolicy` for conditional or specialized behavior. Apply policies at the top-level logger before events are created; a downstream sub-logger sees events that already contain captured values.

## Safe destructuring rules

- Log an explicit allowlisted projection, not an entire object graph.
- Keep collections and strings bounded; large payloads increase event cost and storage.
- Exclude secrets and personal data unless capture is justified and protected.
- Verify the resulting shape in the actual destination, because sinks serialize properties differently.

Reference: [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data).
