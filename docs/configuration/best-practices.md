# Configuration best practices

- Keep logger construction centralized at application startup.
- Configure at least one sink and verify output in each environment.
- Use `Information` or a team-approved production default; raise noisy framework namespaces with overrides.
- Use separate environment files for safe operational differences, not secrets.
- Keep sink-specific configuration beside the sink's package documentation and pin compatible package versions.
- Avoid duplicate configuration through both the generic `Logging` section and Serilog unless you understand how providers are connected.
- Validate required endpoints and credentials at deployment time; do not log secrets.
- Set file rolling, retention, and disk monitoring explicitly for file-based logging.
- Treat dynamic level changes and remote control as operational capabilities that need access control and auditability.

References: [Configuration Basics](https://github.com/serilog/serilog/wiki/Configuration-Basics), [Settings.Configuration](https://github.com/serilog/serilog-settings-configuration).
