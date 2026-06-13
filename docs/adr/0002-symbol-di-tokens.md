# ADR 0002: Use Symbol-Based NestJS DI Tokens

## Status

Accepted

## Context

CAP adapters are independent packages. The core package should not import
concrete storage or transport classes, and adapter registration should avoid
string-token collisions.

## Decision

CAP exposes Symbol-based NestJS dependency injection tokens for storage and
transport:

- `PUBLISH_STORAGE`
- `RECEIVED_STORAGE`
- `PUBLISHER`
- `SUBSCRIBER`

Adapters bind these tokens with Nest providers.

## Consequences

- The core package depends only on interfaces and tokens.
- Adapters can be implemented and released independently.
- Applications can swap storage or transport implementations.
- Documentation and examples must consistently use the exported tokens.

## Links

- [Adapters](../adapters.md)
- [Architecture](../architecture.md)
