# Architecture Decision Records

Architecture Decision Records (ADRs) capture durable technical decisions for
CAP. Use ADRs for choices that affect reliability semantics, public interfaces,
adapter boundaries, package boundaries, or operational behavior.

## Format

- Copy [0000-template.md](0000-template.md).
- Use the next sequential number.
- Keep the status explicit: `Proposed`, `Accepted`, `Deprecated`, or
  `Superseded`.
- Link related docs or follow-up ADRs when a decision changes.

## Accepted Decisions

- [0001 - Use outbox and inbox as the reliability model](0001-outbox-inbox-reliability.md)
- [0002 - Use Symbol-based NestJS DI tokens](0002-symbol-di-tokens.md)
- [0003 - Keep storage and transport pluggable](0003-pluggable-adapters.md)
- [0004 - Ship the dashboard as an optional module](0004-optional-dashboard-module.md)
- [0005 - Prefer transactional outbox with post-commit publishing](0005-transactional-outbox-post-commit.md)
- [0006 - Keep CapModule global for v1](0006-cap-module-global-scope.md)
