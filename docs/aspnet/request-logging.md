# Request logging middleware

ASP.NET Core can emit several framework events for one request. `UseSerilogRequestLogging()` condenses request completion into a single event with method, path, status code, and elapsed time properties.

```csharp
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSerilog((services, cfg) => cfg
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext());

var app = builder.Build();
app.UseSerilogRequestLogging(options =>
{
    options.GetLevel = (context, elapsed, exception) =>
        exception is not null || context.Response.StatusCode >= 500
            ? LogEventLevel.Error
            : LogEventLevel.Information;
    options.EnrichDiagnosticContext = (diagnostic, context) =>
    {
        diagnostic.Set("RequestHost", context.Request.Host.Value);
        diagnostic.Set("RequestScheme", context.Request.Scheme);
    };
});

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.Run();
```

`Serilog.AspNetCore` supplies the middleware. `GetLevel` chooses a severity from completion details. `EnrichDiagnosticContext` adds selected request properties to that completion event. Place the middleware before routes/handlers to include them in timing; place it after static-file middleware if static assets should be excluded. Be cautious with host, query, and user data because request values may contain sensitive information.

Expected event properties include `RequestMethod`, `RequestPath`, `StatusCode`, and `Elapsed`; exact rendered output depends on sink and template. The package README documents current defaults and options: [Request logging](https://github.com/serilog/serilog-aspnetcore#request-logging).
