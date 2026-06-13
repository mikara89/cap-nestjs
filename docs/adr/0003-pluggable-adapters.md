# ADR 0003: Keep Storage and Transport Pluggable

## Status

Accepted

## Context

Reliable messaging needs differ by deployment. Some applications need relational
storage, some may need different databases, and transport choices vary by cloud
or broker.

## Decision

CAP keeps storage and transport behind small contracts and registers concrete
implementations through Nest modules. The core package provides orchestration,
scanner behavior, scheduler behavior, and an in-memory mode, but production
storage and transport live in adapter packages.

## Consequences

- The core package remains transport- and storage-agnostic.
- First-party adapters can cover common setups without blocking custom adapters.
- Adapter contracts must remain stable and well documented.
- Dashboard performance depends on adapters implementing optional list/find
  helpers.

## Links

- [Adapters](../adapters.md)
- [Roadmap](../roadmap.md)
