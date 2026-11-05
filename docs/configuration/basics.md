# Configuration basics

This chapter follows the official Serilog [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics) guide. It explains how to build a logger, why a sink is necessary, how output templates work, and how minimum levels, enrichers, and filters affect the event pipeline.

## Create a logger

Serilog is configured with `LoggerConfiguration`. Configuration is fluent: choose the minimum level, add enrichers and sinks, then call `CreateLogger()` to create the immutable pipeline.

```csharp
using Serilog;
using Serilog.Events;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)
    .Enrich.WithProperty("Application", "Orders.Api")
    .WriteTo.Console()
    .CreateLogger();

try
{
    Log.Information("Service started for {Environment}", "Production");
}
finally
{
    Log.CloseAndFlush();
}
```

`Log.Logger` installs the process-wide logger used by the static `Log` facade. `MinimumLevel.Debug()` accepts Debug and more severe events. `MinimumLevel.Override()` applies a more restrictive threshold to a source-context prefix such as framework logging. `Enrich.WithProperty()` attaches a constant property. `WriteTo.Console()` adds a console sink. `CloseAndFlush()` should be called during orderly shutdown so buffered sinks can release resources and flush pending events.

Install `Serilog` and `Serilog.Sinks.Console` for this example. A logger with no configured sink may create events but has nowhere to write them; a sink is required for observable output.

## Sinks and multiple destinations

A sink adapts Serilog log events to a destination. Sinks are installed as separate NuGet packages. For example, install `Serilog.Sinks.File` to write to files:

```csharp
var logger = new LoggerConfiguration()
    .WriteTo.Console()
    .WriteTo.File("logs/app-.log", rollingInterval: RollingInterval.Day)
    .CreateLogger();
```

Each `WriteTo` call adds another destination. An event accepted by the logger can be delivered to both sinks. The File sink's `rollingInterval: RollingInterval.Day` uses a dated filename pattern; retention, disk monitoring, and backup still need an explicit policy.

## Text output templates

Text-based sinks allow the output line to be customized. The template formats event values for a person reading text; it does not erase the structured event properties that a structured sink can store.

```csharp
.WriteTo.Console(outputTemplate:
    "{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
```

`Timestamp`, `Level`, `Message`, `NewLine`, and `Exception` are built-in tokens. `u3` renders a compact uppercase level such as `INF`; `w3` produces a lowercase abbreviation. `Message:lj` uses the message renderer's literal/JSON display hints so non-string values are clearly represented. `{Properties:j}` includes additional event properties, including properties added by enrichers. `{SourceContext}` can show which named logger emitted an event.

For example:

```csharp
.WriteTo.Console(outputTemplate:
    "[{Timestamp:HH:mm:ss} {Level:u3}] {SourceContext} {Message:lj} {Properties:j}{NewLine}{Exception}")
```

Output templates are for text sinks. A JSON sink uses its own event formatter and serializes structured properties according to that package's behavior.

## Minimum level and per-sink level

The logger minimum level decides whether a call produces an event at all. By default, Serilog processes `Information` and higher. Set a lower threshold to collect diagnostic detail:

```csharp
var logger = new LoggerConfiguration()
    .MinimumLevel.Debug()
    .WriteTo.File("logs/all-.log", rollingInterval: RollingInterval.Day)
    .WriteTo.Console(restrictedToMinimumLevel: LogEventLevel.Information)
    .CreateLogger();
```

Here Debug events can reach the file, while the console sink accepts only Information and more severe events. A sink-level threshold can further restrict events, but cannot recover events the logger's global threshold already rejected. If the logger minimum is Information, a sink configured for Debug still receives no Debug events because they were never created.

## Enrichers

Enrichers add, remove, or alter event properties as events pass through configuration. They can attach environment metadata, an application version, or ambient request context. A custom enricher implements `ILogEventEnricher`:

```csharp
using Serilog.Core;
using Serilog.Events;

var logger = new LoggerConfiguration()
    .Enrich.With(new BuildEnricher("2026.11.05.1"))
    .WriteTo.Console(outputTemplate: "[{Level:u3}] {Build} {Message:lj}{NewLine}{Exception}")
    .CreateLogger();

public sealed class BuildEnricher : ILogEventEnricher
{
    private readonly string _build;

    public BuildEnricher(string build) => _build = build;

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("Build", _build));
    }
}
```

`AddPropertyIfAbsent()` avoids replacing a value already present on that event. The `WithProperty()` shortcut is simpler for a constant property known during startup. Enriched fields are especially useful with structured destinations because they can be queried independently of the message text.

## Filters and sub-loggers

Filters are predicates over `LogEvent`. Use them to include or exclude events based on event properties when a level threshold alone is insufficient:

```csharp
using Serilog.Filters;

var logger = new LoggerConfiguration()
    .Filter.ByExcluding(Matching.WithProperty<int>("Count", count => count < 10))
    .WriteTo.Console()
    .CreateLogger();
```

The filter excludes events whose `Count` property is below 10. Filters should be documented and tested so useful diagnostics are not silently removed.

When one destination needs a separate filtering pipeline, a sub-logger can be configured under `WriteTo.Logger(...)`. The nested logger receives already-created events. Consequently, destructuring configuration belongs on the top-level logger where property capture happens; setting a destructuring policy only inside a sub-logger is too late.

References: [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Enrichment](https://github.com/serilog/serilog/wiki/Enrichment), [Filtering](https://github.com/serilog/serilog/wiki/Filtering).
