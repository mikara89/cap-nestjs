# Transactions

CAP supports transaction-aware publishing through the existing `tx` option and
the v2.2 operation context option.

Existing `tx` style:

```ts
await cap.publish('user.created', payload, { tx: em });
```

New `ctx` style:

```ts
await cap.publish('user.created', payload, { ctx: { tx: em } });
```

When both are present, `ctx` wins over `tx`.

When `tx` or `ctx.tx` is provided, CAP saves the outbox row inside that
transaction and defers broker emit by default. The scheduler dispatches after
commit. Use `immediate: true` only when intentionally attempting broker emit in
the same call:

```ts
await cap.publish('user.created', payload, {
  ctx: { tx: em },
  immediate: true,
});
```

Immediate emit is intentionally not atomic across the database and broker. If
the broker emit fails, CAP keeps the persisted outbox row and marks it for retry
instead of rethrowing from `publish()`.
