# Other provided sinks and custom sink overview

The Serilog ecosystem includes sinks for databases, cloud providers, diagnostics, messaging, and test output. The maintained list changes over time, and many packages are community-maintained. Search the [official provided sinks catalog](https://github.com/serilog/serilog/wiki/Provided-Sinks) or NuGet's [Serilog tag](https://www.nuget.org/packages?q=Tags%3Aserilog). Review each repository's maintenance status, licensing, supported targets, and operational behavior.

## Custom sink overview

Before writing a sink, check whether an existing package or adapter already serves the destination. A sink must accept `LogEvent` instances, handle disposal, and define what happens under destination failure or backpressure. Most production sinks should batch and avoid blocking application threads; implementing these details correctly is nontrivial. Follow Serilog's sink abstractions and examples in the [core repository](https://github.com/serilog/serilog), and test concurrency, shutdown, failure, and memory limits. This handbook intentionally does not present a minimal custom sink as production-ready.

For most team-specific enrichment or shaping, a custom enricher or destructuring policy is a smaller extension point than a custom sink.
