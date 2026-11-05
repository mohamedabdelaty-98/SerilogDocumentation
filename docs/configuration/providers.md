# Configuration providers and environments

`WebApplication.CreateBuilder(args)` loads standard configuration sources, including JSON files and environment variables. The exact ordering is host-defined; later providers generally override earlier values. `Serilog.Settings.Configuration` consumes the resulting `IConfiguration` tree, so settings can be supplied by any registered provider.

## Environment-specific files

ASP.NET Core loads `appsettings.json` and the matching `appsettings.{Environment}.json` when present. Use these for non-secret differences, such as local verbosity. Keep the base file safe for the normal deployment and avoid committing machine-specific paths or secrets.

```json
{
  "Serilog": {
    "MinimumLevel": {
      "Default": "Debug"
    }
  }
}
```

An environment variable uses double underscores to represent nested configuration keys, for example `Serilog__MinimumLevel__Default=Warning`. Arrays and complex sink arguments are awkward to express in environment variables, so keep topology in JSON and use environment variables for scalar overrides where practical.

## Minimum levels and source overrides

The default minimum level controls all sources. Overrides such as `Microsoft` or `System` suppress noisy framework events while keeping application events at the default level. A runtime update can change configured existing values when the provider supports reload; adding new override keys at runtime is not supported by the settings provider's documented behavior.

Reference: [Settings.Configuration: MinimumLevel and overrides](https://github.com/serilog/serilog-settings-configuration#minimumlevel-levelswitches-overrides-and-dynamic-reload).
