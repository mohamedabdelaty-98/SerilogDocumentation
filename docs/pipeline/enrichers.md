# Enrichers

Enrichers attach properties to events consistently. Common examples include application name, environment, machine name, and ambient `LogContext` values. Prefer stable, useful dimensions and avoid adding large or sensitive values.

## Static properties and ambient context

```csharp
var logger = new LoggerConfiguration()
    .Enrich.WithProperty("Application", "Orders.Api")
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .CreateLogger();
```

`WithProperty()` adds a constant property. `FromLogContext()` enables properties pushed with `LogContext` and scopes bridged by integrations.

## Custom enricher

```csharp
using Serilog.Core;
using Serilog.Events;

public sealed class DeploymentEnricher : ILogEventEnricher
{
    private readonly string _deployment;

    public DeploymentEnricher(string deployment) => _deployment = deployment;

    public void Enrich(LogEvent logEvent, ILogEventPropertyFactory propertyFactory)
    {
        logEvent.AddPropertyIfAbsent(propertyFactory.CreateProperty("Deployment", _deployment));
    }
}
```

Register it in code with `.Enrich.With(new DeploymentEnricher(deploymentName))`. Implement `ILogEventEnricher` and create properties through the provided factory. `AddPropertyIfAbsent` avoids replacing a value already attached to an event. The type is in the `Serilog` package. Keep enrichers deterministic and inexpensive because they can run for many events.

References: [Enrichment wiki](https://github.com/serilog/serilog/wiki/Enrichment), [Structured Data](https://github.com/serilog/serilog/wiki/Structured-Data).
