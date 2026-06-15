# ADR 0006: Keep CapModule Global for v1

## Status

Accepted

## Context

CAP is registered once at the application root with storage, transport,
scheduler, and initialization options. Application services and discovered
subscribers may live across many Nest modules, but they all use the same CAP
runtime contracts and adapter tokens.

Nest modules can make this wiring explicit through repeated imports or make it
application-wide through a global module. CAP currently uses `@Global()` on
`CapModule`.

## Decision

Keep `CapModule` global for v1. Applications should register CAP once in the
root module with `CapModule.forRoot(...)` or `CapModule.forRootAsync(...)`.
`CapService` is then available app-wide for publishing, while adapter ownership
remains explicit through the modules passed in `imports`.

## Consequences

- The stable v1 module contract favors one CAP configuration per Nest
  application.
- Feature modules do not need to re-import `CapModule` only to inject
  `CapService`.
- Applications that need multiple independent CAP configurations should use
  separate Nest application contexts or a future scoped module design.
- Storage and transport modules still need to export the CAP tokens they
  provide.

## Links

- [Architecture](../architecture.md)
- [Getting started](../getting-started.md)
