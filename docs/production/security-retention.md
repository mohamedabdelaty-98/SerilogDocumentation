# Sensitive data protection and log retention

Logs often move across trust boundaries and remain searchable for long periods. Treat them as production data.

- Do not log passwords, access tokens, API keys, payment card data, private keys, or complete request/response bodies.
- Prefer allowlisted projections over destructuring domain or persistence objects.
- Redact or omit personal data unless a documented purpose and retention policy permit it.
- Protect sink credentials and central store access with secret management and least privilege.
- Use TLS and network restrictions for remote destinations where supported.
- Define retention, deletion, backup, and legal-hold requirements at the destination. A Serilog rolling file limit is not a complete retention program.
- Limit access to production logs and audit access where required.

Property names are schema too: avoid names that expose personal information or create accidental cardinality explosions. Review representative captured events before rollout.
