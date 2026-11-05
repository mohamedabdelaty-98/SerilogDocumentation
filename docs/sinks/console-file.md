# Console and file sinks

Install `Serilog.Sinks.Console` and/or `Serilog.Sinks.File` alongside `Serilog`.

```csharp
var logger = new LoggerConfiguration()
    .MinimumLevel.Information()
    .WriteTo.Console(outputTemplate:
        "[{Timestamp:HH:mm:ss} {Level:u3}] {Message:lj}{NewLine}{Exception}")
    .WriteTo.File(
        "logs/app-.log",
        rollingInterval: RollingInterval.Day,
        retainedFileCountLimit: 14,
        outputTemplate: "{Timestamp:O} [{Level:u3}] {Message:lj}{NewLine}{Exception}")
    .CreateLogger();
```

The console sink writes text to standard output by default; it suits local use and container log collection. The file sink writes text files, and `RollingInterval.Day` creates date-based files. `retainedFileCountLimit` limits retained rolling files; coordinate this with external backup and compliance requirements. Output templates control text layout, and `{Exception}` ensures exception details are rendered.

An expected console line resembles:

```text
[14:02:11 INF] Order 4812 accepted
```

File logging does not itself provide centralized search or a complete backup strategy. Monitor disk usage and test process shutdown behavior. References: [Console package](https://www.nuget.org/packages/Serilog.Sinks.Console), [File package](https://www.nuget.org/packages/Serilog.Sinks.File), [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics).
