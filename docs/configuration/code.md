# Code-based configuration

`LoggerConfiguration` is a fluent builder. Configure minimum levels, overrides, enrichers, filters, destructuring policies, and sinks, then call `CreateLogger()` once the pipeline is complete.

```csharp
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.WithProperty("Application", "Orders.Api")
    .WriteTo.Console()
    .WriteTo.File("logs/orders-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

`MinimumLevel.Override()` targets a source-context prefix, commonly framework logs. `Enrich.WithProperty()` attaches a constant field to every event. `WriteTo` adds independent destinations. Core package plus Console and File sink packages are required.

## Output templates

Text sinks support output templates. For example:

```csharp
.WriteTo.Console(outputTemplate:
    "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}")
```

`Timestamp`, `Level`, `Message`, `NewLine`, and `Exception` are built-in tokens. `{SourceContext}` and custom properties appear when present. Output templates control human-readable text; they do not define the structured event schema sent by a structured sink.

Reference: [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics).
