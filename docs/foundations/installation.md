# Installation and first logger

Serilog is distributed through NuGet packages. The core `Serilog` package defines the logger and event pipeline; each destination is added with its own sink package. For the console example install `Serilog` and `Serilog.Sinks.Console`.

```sh
dotnet new console -n LoggingDemo
cd LoggingDemo
dotnet add package Serilog
dotnet add package Serilog.Sinks.Console
```

```csharp
using Serilog;

Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console()
    .CreateLogger();

try
{
    Log.Information("Service started for {Environment}", "Development");
}
finally
{
    Log.CloseAndFlush();
}
```

`LoggerConfiguration` builds the pipeline. `MinimumLevel.Information()` enables Information and more severe levels. `WriteTo.Console()` adds the console sink. `CreateLogger()` finalizes configuration. The static `Log` facade is convenient for small samples; larger applications should inject `ILogger<T>` or hold an appropriately scoped logger. `CloseAndFlush()` gives buffered sinks a chance to complete during shutdown.

Expected console output resembles:

```text
[INF] Service started for "Development"
```

References: [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Serilog NuGet package](https://www.nuget.org/packages/Serilog), [Console sink](https://www.nuget.org/packages/Serilog.Sinks.Console).
