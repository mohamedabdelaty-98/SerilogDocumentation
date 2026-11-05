# Architecture and event lifecycle

## Logging event path

```mermaid
flowchart LR
  A[Application] -->|ILogger call| B[Serilog Logger]
  B -->|enabled event| C[Log Event]
  C --> D[Enrichers]
  D --> E{Filters}
  E -->|keep| F[Sink dispatch]
  E -->|reject| X[Discard]
  F --> G[Console sink]
  F --> H[File sink]
  F --> I[Network sink]
  G --> J[Terminal]
  H --> K[Local files]
  I --> L[Central store]
```

**Data flow:** the call supplies a level, template, values, and optionally an exception. The logger checks its minimum level before doing event work. An accepted call becomes a log event; enrichers attach ambient or static properties; filters decide whether it continues; sinks independently write it. Text formatting happens at text sinks, while structured sinks can preserve property types.

| Component | Responsibility |
|---|---|
| Application / `ILogger` | Expresses a diagnostic event without choosing its storage destination. |
| Serilog logger | Applies level rules and owns the configured pipeline. |
| Log event | Carries timestamp, level, template, bound properties, and exception. |
| Enricher | Adds consistent context such as service name or correlation ID. |
| Filter | Removes events that meet a configured condition. |
| Sink | Adapts and writes the event to a destination. |
| Destination | Stores or displays the resulting event for operations and investigation. |

## Event lifecycle detail

```mermaid
sequenceDiagram
  participant App as Application
  participant Log as Serilog Logger
  participant Event as Log Event
  participant Enrich as Enrichers
  participant Filter as Filters
  participant Sink as Sinks
  participant Store as Destination
  App->>Log: Information(template, values)
  Log->>Log: Check effective minimum level
  alt event enabled
    Log->>Event: Create timestamp, level, template, properties
    Event->>Enrich: Apply static and ambient context
    Enrich->>Filter: Evaluate enriched event
    alt event passes
      Filter->>Sink: Dispatch event
      Sink->>Store: Format/serialize and write
    else filtered out
      Filter-->>Log: Drop event
    end
  else below minimum
    Log-->>App: No event created
  end
```

Filters and level thresholds are useful controls, but they are not substitutes for careful event design: avoid constructing expensive values unless a level is enabled, and avoid putting secrets into the event in the first place.

References: [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Writing Log Events](https://github.com/serilog/serilog/wiki/Writing-Log-Events).
