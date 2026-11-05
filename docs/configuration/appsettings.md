# Configuration with appsettings.json

Install packages:

```sh
dotnet add package Serilog.AspNetCore
dotnet add package Serilog.Settings.Configuration
dotnet add package Serilog.Sinks.Console
dotnet add package Serilog.Sinks.File
```

Configure the `Serilog` section:

```json
{
  "Serilog": {
    "Using": [ "Serilog.Sinks.Console", "Serilog.Sinks.File" ],
    "MinimumLevel": {
      "Default": "Information",
      "Override": {
        "Microsoft": "Warning",
        "Microsoft.AspNetCore": "Warning"
      }
    },
    "Enrich": [ "FromLogContext" ],
    "Properties": {
      "Application": "Orders.Api"
    },
    "WriteTo": [
      { "Name": "Console" },
      {
        "Name": "File",
        "Args": {
          "path": "logs/orders-.log",
          "rollingInterval": "Day",
          "retainedFileCountLimit": 14
        }
      }
    ]
  }
}
```

Then load settings in the host:

```csharp
var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSerilog((services, configuration) => configuration
    .ReadFrom.Configuration(builder.Configuration)
    .ReadFrom.Services(services));
```

`Using` helps identify sink assemblies; modern package discovery can also find configuration assemblies automatically in common deployment modes. `MinimumLevel` sets the default and source overrides. `Properties` adds static event properties. `WriteTo` declares sinks and their arguments. The `Serilog.AspNetCore` and `Serilog.Settings.Configuration` packages plus sink packages are needed. Verify configuration assembly discovery when publishing single-file apps.

Never put API keys or passwords in checked-in JSON. Supply secrets via a secret store or protected deployment configuration. See [Settings.Configuration documentation](https://github.com/serilog/serilog-settings-configuration).
