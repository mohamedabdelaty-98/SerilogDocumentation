# Performance and reliability

Logging consumes CPU, memory, disk, and network capacity. Good event design often matters more than micro-optimizing logger calls.

- Use stable templates; avoid string concatenation/interpolation when properties should remain structured.
- Keep high-volume events at an appropriate level and use source overrides for noisy framework categories.
- Avoid expensive serialization and deep destructuring of large object graphs.
- Use bounded properties and avoid unbounded cardinality where destination indexing costs are high.
- Review a sink's batching, buffering, retry, and backpressure policies. Async wrappers can shift I/O work, but introduce buffering and shutdown trade-offs; they do not make a destination durable.
- Flush/dispose the logger on orderly shutdown and test behavior during termination.
- For a potentially expensive value, guard its creation with `logger.IsEnabled(level)` when measurement shows it matters.

```csharp
if (logger.IsEnabled(Serilog.Events.LogEventLevel.Debug))
{
    var expensive = BuildDiagnosticSnapshot();
    logger.Debug("Snapshot {@Snapshot}", expensive);
}
```

This avoids computing the snapshot when Debug is disabled. Measure with representative workloads and the actual sink. See the relevant package documentation and [Provided Sinks](https://github.com/serilog/serilog/wiki/Provided-Sinks).
