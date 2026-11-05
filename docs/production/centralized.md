# Centralized logging

Centralized logging is a deployment pattern: applications emit events to a shared system that provides search and operational views. It is not a built-in Serilog service. Choose a backend such as Seq or Elasticsearch and configure the matching sink.

Give each event useful identity fields such as `Application`, `Environment`, `ServiceVersion`, and correlation/trace identifiers. Use consistent property names across services so queries work across the fleet. Ensure central storage access, transport, retention, and user permissions match organizational policy.

Architecture and data flow are shown in [Seq and Elasticsearch](../sinks/centralized.md). Treat sink outage as a normal operational scenario: understand buffering and loss behavior, alert on sustained delivery failure, and avoid unbounded queues that can exhaust application memory.
