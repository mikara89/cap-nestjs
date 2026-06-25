# CAP Node.js Documentation

This folder is the developer documentation for CAP Node.js, a reliable
messaging package set built around outbox/inbox persistence, retry scheduling,
framework adapters, and pluggable storage and transport adapters.

## Reading Path

1. [Getting started](getting-started.md) - smallest working setup and production
   registration shape.
2. [Architecture](architecture.md) - core flow, modules, transactions, and
   diagrams.
3. [Transactions](transactions.md) - publish transaction handles, operation
   contexts, and immediate emit behavior.
4. [Adapters](adapters.md) - storage and transport contracts plus the current
   MikroORM, Azure Service Bus, and NestJS microservices adapters.
5. [Dashboard](cap-dashboard.md) - admin API and UI behavior.
6. [API reference](api/README.md) - generated package API documentation.
7. [Package export surface](package-exports.md) - supported import paths and
   future `exports` map plan.
8. [Future libs layout](architecture/libs-layout.md) - proposed package folder
   grouping without moving folders in v2.1.1.
9. [GitHub Pages homepage](github-pages.md) - public homepage setup.
10. [Roadmap](roadmap.md) - stable 0.7, v1, and later stages.
11. [Release checklist](release.md) - validation and publishing safety.
12. [Schema/API migration](migrations/0.7-to-1.0.md) - upgrade notes for
    stable schema and API behavior.
13. [Framework-agnostic core migration](migration/framework-agnostic-core.md) -
    package rename and adapter split notes.
14. [v2.2 transaction context migration](migration/v2.2-transaction-context.md) -
    operation-context foundation notes.
15. [ADRs](adr/README.md) - durable architecture decisions.
16. [Contributing](contributing.md) - local workflow, repo health checks, tests,
    coverage, and docs rules.

## Current Maturity

The repository is on the stable 0.7 MVP line. The core publish/subscribe path,
first-party adapters, dashboard package, header propagation, release workflow,
and PostgreSQL/MySQL multi-instance claim gate are in place. The
[roadmap](roadmap.md) tracks remaining maturity work for v1 and later stages.

## Documentation Rules

- Keep root `README.md` as the public entry point.
- Keep package READMEs short and link back here for deeper guidance.
- Regenerate `docs/api/` with `npm run docs:api` when public exports change.
- Keep examples compile-checked with `npm run examples:check`.
- Add or update an ADR when a durable architecture decision changes.
- Update the roadmap when work moves between stable 0.7, v1, or later.
