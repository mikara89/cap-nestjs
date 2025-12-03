# Feature: CapHeaders decorator for handler metadata

Status: draft

## Problem / Motivation

CAP handlers currently receive only the deserialized `payload` as an argument.
In some scenarios (debugging, observability, routing, idempotency checks), the
handler also needs access to message metadata / headers – e.g. topic, group,
message IDs, retry count, and raw transport headers.

Right now, this information is either inaccessible from user code or only
available via ad-hoc logging in the transport/storage layers. We want a clean,
typed way for handler methods to receive headers without breaking the existing
API.

Example desired usage:

```ts
@CapSubscribe({ topic: 'example.topic3', group: 'example-group' })
async onExample3(
  payload: unknown,
  @CapHeaders() headers?: CapHeaders,
): Promise<void> {
  this.log.log(
    `CapExampleHandler received payload: ${JSON.stringify(payload)} and headers: ${JSON.stringify(headers)}`,
  );
}
```

## Scope (Packages & Surfaces)

**Packages affected:**

* [x] libs/cap-nest
* [ ] libs/storage-mikro-orm
* [ ] libs/transport-azure-servicebus
* [ ] libs/cap-dashboard
* [ ] apps/cap-test-app (only to add example handler + tests)

**Public API impact:**

* New exported type: `CapHeaders`
* New decorator: `@CapHeaders()` usable on handler parameters of methods
  decorated with `@CapSubscribe`.
* No breaking changes to existing `@CapSubscribe` handlers (payload-only
  signature must still work).

## Behavioural Contract

From the consumer’s perspective:

* Handler methods MAY declare a parameter decorated with `@CapHeaders()`:

  * Typical position: second argument (after `payload`).
  * Parameter type: `CapHeaders` or `CapHeaders | undefined`.

* If declared, CAP will **pass a plain object** with the following shape:

  ```ts
  export interface CapHeaders {
    /** Topic from @CapSubscribe / message envelope */
    topic: string;
    /** Consumer group / subscription name */
    group?: string;
    /** Internal unique message ID (inbox/outbox) */
    messageId?: string;
    /** Correlation / causation IDs if available */
    correlationId?: string;
    causationId?: string;
    /** Retry metadata */
    retryCount?: number;
    /** Transport-specific delivery count if provided */
    deliveryCount?: number;
    /** Original enqueue timestamp / received timestamp if available */
    timestamp?: Date;
    /** Raw headers / properties from transport, if exposed */
    raw?: Record<string, unknown>;
  }
  ```

* If some fields are not provided by the underlying transport / storage, they
  may be `undefined`.

* If handler does NOT declare `@CapHeaders()`, behaviour is unchanged.

* If handler declares `@CapHeaders()` but CAP cannot build headers
  (unexpected edge case), `headers` will be `undefined` rather than throwing.

Non-goals (for this feature):

* No custom per-handler header mapping DSL.
* No mutation of headers downstream – handler receives a plain read-only view.
* No dashboard changes (e.g. UI for headers) – can be handled in a follow-up feature.

## Constraints & Non-goals

* MUST NOT break existing handlers:

  * Old signature `async handle(payload: T)` remains valid.
* MUST keep the handler invocation path simple:

  * We ideally support at most:

    * `handle(payload)`
    * `handle(payload, headers)`
* We assume a single `@CapHeaders()` parameter per handler. Multiple uses are
  unsupported for now.
* `CapHeaders` object must be transport-agnostic; transport-specific details go
  under `raw`.

## Design Sketch

* Add `CapHeaders` interface in `libs/cap-nest` (e.g. `cap/headers/headers.interface.ts`).
* Add `CapHeaders` parameter decorator in `libs/cap-nest` (e.g. `cap/headers/headers.decorator.ts`):

  * Uses NestJS metadata (`Reflect.defineMetadata`) to mark which parameter
    index should receive headers.
* Extend internal message envelope / context (wherever `CapService.tryHandle`
  gets called) to include:

  * topic, group, message IDs, retryCount, deliveryCount, timestamps, raw headers.
* Update handler invocation code (likely inside `CapService.tryHandle` or the
  subscriber callback) to:

  * Inspect metadata for the target method,
  * Build `CapHeaders` object from message context,
  * Call handler with:

    * `handler(payload)` if no headers param, or
    * `handler(payload, headers)` if headers param exists.

Adapter changes:

* For now, we keep adapters unchanged, but we plumb through:

  * Message IDs, topic, group, retryCount, deliveryCount, enqueue time,
  * Transport properties if already available in the current message model.
* If some fields are not currently surfaced, we may add them to the internal
  message envelope in a later iteration.

## Test Strategy

**Unit tests (libs/cap-nest):**

* Test that `@CapHeaders()` stores correct parameter index metadata on handler methods.
* Test a small fake handler where:

  * `CapService.tryHandle` is invoked with a mock message context,
  * Handler is called with both `payload` and expected `headers` object.

**Integration tests (apps/cap-test-app):**

* Add an example handler:

  ```ts
  @CapSubscribe({ topic: 'example.topic3', group: 'example-group' })
  async onExample3(
    payload: ExampleDto,
    @CapHeaders() headers?: CapHeaders,
  ): Promise<void> {
    this.logger.log({ payload, headers });
  }
  ```

* Send a message via normal CAP publish/receive flow and assert (via log or test
  spy) that:

  * `headers.topic` and `headers.group` are set correctly,
  * `headers.retryCount` is `0` on first delivery,
  * `headers.raw` contains at least some transport data (if applicable).

**E2E tests:**

* Optional for now; basic coverage via integration tests is acceptable.

---

## 2) First session doc – designing the API + wiring

**File (suggested):**  
`.ai/cap/sessions/2025-12-03-cap-headers-decorator.md`


# Session: 2025-12-03 – CapHeaders decorator

## 1. Current Intention (max 5 bullets)

- [ ] Define `CapHeaders` interface in `libs/cap-nest`.
- [ ] Implement `@CapHeaders()` decorator and metadata storage (parameter index).
- [ ] Extend handler invocation path to optionally pass headers (payload-only handlers still work).
- [ ] Add/update unit tests in `libs/cap-nest` for decorator + invocation behaviour.
- [ ] Add example usage in `cap-test-app` (handler with `@CapHeaders()`).

## 2. Minimal Context to Show Copilot

- Feature spec: `./.ai/cap/features/2025-12-03-cap-headers-decorator.md`
- Architecture map section for `libs/cap-nest` and handler invocation flow.
- Relevant code:
  - `libs/cap-nest/src/cap/decorators/cap-subscribe.decorator.ts` (or wherever it lives)
  - `libs/cap-nest/src/cap/cap.service.ts` (especially `tryHandle` / handler invoke)
  - `libs/cap-nest/src/cap/subscriber/cap-subscriber-scanner.ts` (or equivalent)
  - Existing test helpers: `libs/cap-nest/src/testing/*`

## 3. Plan for This Session

1. Scan current `CapService` and subscriber code to find the exact handler invocation spot.
2. Introduce `CapHeaders` interface + simple constant METADATA_KEY for headers param.
3. Implement `@CapHeaders()` decorator that stores parameter index on the method.
4. In the handler invocation path:
   - Read parameter index metadata if present.
   - Build a minimal `CapHeaders` object: `{ topic, group, retryCount }` to start.
   - Call handler with either `(payload)` or `(payload, headers)` depending on metadata.
5. Add unit tests for:
   - Metadata from `@CapHeaders()`.
   - Handler invoked with headers when decorator is present.

## 4. Notes During Session

(TO BE FILLED as we go; examples:)

- Decided to keep only one `@CapHeaders()` per method; if multiple, last one wins.
- `CapHeaders` kept small for now; can be extended later.
- Initial `headers.raw` left `undefined` until we confirm transport metadata shape.

## 5. End-of-session Compaction

(To be filled at end of work; Copilot can help summarize:)

### What changed (3–7 bullets)
- tbd

### Important Decisions
- tbd

### Follow-up
- [ ] Extend headers with correlation IDs and transport properties.
- [ ] Add integration test in `cap-test-app` asserting real headers.


---

## 3) Concrete code sketch for the feature

Here’s a **rough implementation sketch** to guide your actual code changes.

### 3.1 `CapHeaders` interface

`libs/cap-nest/src/cap/headers/cap-headers.interface.ts`:

```ts
export interface CapHeaders {
  topic: string;
  group?: string;
  messageId?: string;
  correlationId?: string;
  causationId?: string;
  retryCount?: number;
  deliveryCount?: number;
  timestamp?: Date;
  raw?: Record<string, unknown>;
}
```

Export it from your public API (`libs/cap-nest/src/index.ts`):

```ts
export * from './cap/headers/cap-headers.interface';
export * from './cap/headers/cap-headers.decorator';
```

### 3.2 `@CapHeaders()` decorator

`libs/cap-nest/src/cap/headers/cap-headers.decorator.ts`:

```ts
import 'reflect-metadata';

export const CAP_HEADERS_PARAM_METADATA = Symbol('CAP_HEADERS_PARAM_METADATA');

/**
 * Marks a handler parameter to receive CapHeaders.
 *
 * Example:
 *   async onExample3(payload: T, @CapHeaders() headers?: CapHeaders) { ... }
 */
export function CapHeaders(): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    const existing: number | undefined = Reflect.getMetadata(
      CAP_HEADERS_PARAM_METADATA,
      target,
      propertyKey,
    );

    // For now we keep a single index; if multiple decorators are used, last wins.
    const indexToStore = parameterIndex;

    Reflect.defineMetadata(
      CAP_HEADERS_PARAM_METADATA,
      indexToStore,
      target,
      propertyKey,
    );
  };
}
```

### 3.3 Using it in the handler invocation

Somewhere in your `CapService` / subscriber flow you likely have something like:

```ts
// Pseudo-code in CapService or subscriber callback
await handler(payload);
```

You’ll change that to something like (simplified example):

```ts
import { CAP_HEADERS_PARAM_METADATA } from '../headers/cap-headers.decorator';
import { CapHeaders } from '../headers/cap-headers.interface';

private async invokeHandler(
  handlerInstance: any,
  handlerMethodName: string,
  payload: unknown,
  ctx: {
    topic: string;
    group?: string;
    messageId?: string;
    correlationId?: string;
    causationId?: string;
    retryCount?: number;
    deliveryCount?: number;
    timestamp?: Date;
    raw?: Record<string, unknown>;
  },
): Promise<void> {
  const method = handlerInstance[handlerMethodName];
  const headersParamIndex: number | undefined = Reflect.getMetadata(
    CAP_HEADERS_PARAM_METADATA,
    handlerInstance,
    handlerMethodName,
  );

  if (headersParamIndex === undefined) {
    // Old-style handler: only payload
    return method.call(handlerInstance, payload);
  }

  const headers: CapHeaders = {
    topic: ctx.topic,
    group: ctx.group,
    messageId: ctx.messageId,
    correlationId: ctx.correlationId,
    causationId: ctx.causationId,
    retryCount: ctx.retryCount,
    deliveryCount: ctx.deliveryCount,
    timestamp: ctx.timestamp,
    raw: ctx.raw,
  };

  const args: unknown[] = [];

  // Assuming handlers currently expect payload at index 0.
  // For now we support signature: (payload, headers?)
  args[0] = payload;
  args[headersParamIndex] = headers;

  return method.apply(handlerInstance, args);
}
```

Then, from `tryHandle` (or wherever you already know topic/group/etc.), you call:

```ts
await this.invokeHandler(handlerInstance, methodName, payload, {
  topic: message.topic,
  group: message.group,
  messageId: message.id,
  correlationId: message.correlationId,
  causationId: message.causationId,
  retryCount: message.retryCount,
  deliveryCount: message.deliveryCount,
  timestamp: message.timestamp,
  raw: message.rawHeaders,
});
```

For a first iteration, you can even **hardcode** the handler signature assumption:

* `payload` is first param.
* If metadata exists, second param is `headers`.

The decorator then becomes more of a “self-documenting marker” rather than strictly required for injection (but you *can* enforce that later by checking the param index).

