# @mikara89/cap-core

Framework-agnostic CAP engine, models, ports, utilities, scheduler, and
in-memory testing adapters.

Use this package directly when building non-Nest adapters, workers, tests, or
custom framework integrations.

```ts
import { CapEngine } from '@mikara89/cap-core';

const engine = new CapEngine({
  publishStorage,
  receivedStorage,
  publisher,
  subscriber,
});
```

NestJS users can continue importing compatible CAP types through
`@mikara89/cap-nest`.

## Transaction Context

Existing transaction-handle publishing remains supported:

```ts
await cap.publish('user.created', payload, { tx: em });
```

New code can pass a CAP operation context:

```ts
await cap.publish('user.created', payload, { ctx: { tx: em } });
```

When `tx` or `ctx.tx` is provided, CAP saves the outbox row inside that
transaction and defers broker emit by default. The scheduler dispatches after
commit. Use `immediate: true` only when intentionally attempting broker emit in
the same call.
