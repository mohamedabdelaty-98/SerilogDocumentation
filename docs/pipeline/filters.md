# Filters

Filters prevent matching events from reaching downstream sinks. They are useful for suppressing known noise or routing by event properties, but should not hide failures needed for diagnosis or compliance.

```csharp
using Serilog.Filters;

var logger = new LoggerConfiguration()
    .Filter.ByExcluding(Matching.FromSource("Microsoft.AspNetCore.StaticFiles"))
    .WriteTo.Console()
    .CreateLogger();
```

`ByExcluding()` drops events for which the predicate matches. `Matching.FromSource()` matches a source-context prefix. The filter APIs are provided by Serilog; more complex conditions can be expressed with predicates against `LogEvent`. Filtering differs from minimum levels: levels decide whether an event is enabled by severity/source, while filters evaluate event content or other criteria.

Apply filters intentionally, document why the event is excluded, and check their behavior when upgrading integrations. References: [Serilog Filtering](https://github.com/serilog/serilog/wiki/Filtering).
