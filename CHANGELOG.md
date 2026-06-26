# Changelog

All notable repository-level changes should be summarized here.

Package-specific changelogs are maintained with each publishable package:

- [@mikara89/cap-nest](libs/cap-nest/CHANGELOG.md)
- [@mikara89/cap-testing](libs/cap-testing/CHANGELOG.md)
- [@mikara89/cap-storage-mikro-orm](libs/cap-storage-mikro-orm/CHANGELOG.md)
- [@mikara89/cap-transport-azure-servicebus](libs/cap-transport-azure-servicebus/CHANGELOG.md)
- [@mikara89/cap-transport-nestjs-microservices](libs/cap-transport-nestjs-microservices/CHANGELOG.md)
- [@mikara89/cap-dashboard-nest](libs/cap-dashboard-nest/CHANGELOG.md)
- [@mikara89/cap-dashboard](libs/cap-dashboard/CHANGELOG.md)

## Unreleased

- Added public repository documentation and GitHub community templates for open
  source readiness.
- Added generated API documentation tooling, compile-checked examples, and a
  package export-surface audit.

## 2.2.0 (2026-06-26)

- Added the transaction context foundation with `CapOperationContext`, `ctx`
  publish support, optional ambient context, and the `CapTransactionManagerPort`
  extension point.
- Added MikroORM operation-context support, reusable publish-storage contract
  tests, and informational storage capability metadata.
- Kept existing `tx` publish calls working, with `ctx` taking precedence when
  both options are provided, and retained `savePublishWithTx` only as deprecated
  compatibility.
- No breaking changes are expected for existing transaction-handle users.

## 0.7.0-beta.0

- First beta package line for the CAP for NestJS MVP package set.
- Includes the core CAP module, MikroORM storage, Azure Service Bus transport,
  NestJS microservices transport, and optional dashboard package.
