# CAP NestJS Library - Copilot Instructions

## Project Overview

**Cloud Access Pattern (CAP)** library for NestJS implementing reliable message handling through outbox/inbox patterns with automatic retry mechanisms. Core library (`libs/cap-nest`) provides abstractions; separate adapter packages handle storage (MikroORM) and transport (Azure Service Bus).

## Architecture

### Core Components
- **`CapService`** (`libs/cap-nest/src/cap/cap.service.ts`) - Main facade: `publish()` saves to outbox + emits, `subscribe()` registers handlers
- **Symbol-based IoC** - `PUBLISH_STORAGE`, `RECEIVED_STORAGE`, `PUBLISHER`, `SUBSCRIBER` tokens in `abstractions/*.interface.ts` enable adapter swapping
- **Outbox/Inbox Tables** - Messages persist *before* transport attempts; failed messages retry via scheduler
- **Scheduler** (`libs/cap-nest/src/cap/scheduler/`) - Cron jobs retry unpublished (30s) and failed received messages (1min) with exponential backoff + jitter

### Message Flow
1. **Publish**: `CapService.publish()` → `IPublishStorage.savePublish()` → `IPublisher.publish()` → `markPublished()` on success
2. **Subscribe**: `@CapSubscribe` decorator → `CapSubscriberScanner` discovers handlers → `ISubscriber.subscribe()` registers
3. **Receive**: Transport delivers → `CapService.tryHandle()` → handler executes → `markProcessed()` or `scheduleRetry()`
4. **Retry**: Scheduler fetches due messages → re-executes handlers with backoff (`backoff.util.ts`: `min(1000ms * 2^attempt + jitter, 300000ms)`)

## Monorepo Structure

```
libs/
  cap-nest/              # Core library (public API in src/index.ts)
  storage-mikro-orm/     # MikroORM adapter (entities: CapPublish, CapReceived)
  transport-azure-servicebus/  # Azure Service Bus adapter
  cap-dashboard/         # Optional web UI for message monitoring
apps/
  cap-test-app/          # Integration test app
```

**Module aliases** (see `package.json` jest config):
- `@cap/cap-nest` → `libs/cap-nest/src`
- `@cap/mikroorm-storage` → `libs/storage-mikro-orm/src`
- `@cap/azure-servicebus-transport` → `libs/transport-azure-servicebus/src`

## Development Workflows

### Building
```powershell
npm run build          # Builds all libs sequentially then test app
npm run build:libs     # Individual: build:lib:cap-nest, build:lib:storage, build:lib:transport
```
**Critical**: Build libs before test app (deps must exist in `dist/`)

### Testing
```powershell
npm test                    # All unit tests (*.spec.ts)
npm run test:integration    # Integration tests (uses TestContainers for Postgres)
npm run test:e2e            # E2E tests
npm run test:cov            # Coverage (excludes libs/cap-nest/src/testing/)
```
**Test-first mandate**: Write `.spec.ts` alongside implementation before coding features

### Code Quality
```powershell
npm run lint      # ESLint auto-fix
npm run format    # Prettier
```
Strict TypeScript enabled in `libs/cap-nest/tsconfig.lib.json` (`strict: true`, `noImplicitAny: true`)

## Key Patterns & Conventions

### Creating Adapters
1. **Storage adapter** must implement `IPublishStorage` + `IReceivedStorage` (see `libs/storage-mikro-orm/src/storage/`)
2. **Transport adapter** implements `IPublisher` + `ISubscriber` (see `libs/transport-azure-servicebus/src/transport/`)
3. Export `providers` array binding Symbol tokens:
   ```typescript
   // storage-mikro-orm/src/mikro-storage.module.ts
   providers: [
     { provide: PUBLISH_STORAGE, useClass: MikroPublishStorage },
     { provide: RECEIVED_STORAGE, useClass: MikroReceivedStorage }
   ]
   ```
4. Optional: Implement `initialize(options?: InitOptions)` for schema/queue creation during bootstrap
   - `InitOptions` interface: `{ autoInit?: boolean, createSchema?: boolean, createQueues?: boolean }`
   - Storage adapters use `createSchema` to run schema generators or migrations
   - Transport adapters use `createQueues` to create topics/subscriptions
   - Called automatically during module initialization if `init` provided to `CapModule.forRoot()`
   - Example: MikroORM adapter calls `orm.getSchemaGenerator().createSchema()` when `createSchema: true`

### Module Configuration
```typescript
// Adapter-based (recommended)
CapModule.forAdapters(MikroStorageModule, ServiceBusTransportModule, { createSchema: true })

// Raw providers (advanced)
CapModule.forRoot({ storage: [...], transport: [...], init: { createQueues: true } })

// In-memory (tests only)
CapModule.forInMemory()
```

### Message Handlers
Use `@CapSubscribe` on methods in NestJS providers:
```typescript
// apps/cap-test-app/src/cap-example.handler.ts
@CapSubscribe({ topic: 'user.created', group: 'notifications', dto: UserCreatedDto })
async handleUserCreated(payload: UserCreatedDto) {
  // Auto-validated via CapValidatePipe if dto provided
  await this.emailService.send(payload.email);
}
```
**Scanner auto-discovers** these on module init via NestJS reflection (`ModulesContainer`)

### Transactional Outbox
Storage adapters can optionally implement `ITransactionalPublishStorage`:
```typescript
// libs/cap-nest/src/cap/utils/transaction.util.ts
import { publishWithTx } from '@cap/cap-nest';

await publishWithTx(em, capService, { topic: 'order.created', payload: order });
// Message persisted in same DB transaction as business logic
```

### Testing Symbol-Based Dependencies
```typescript
// Use NestJS testing utilities
const module = await Test.createTestingModule({
  providers: [
    CapService,
    { provide: PUBLISH_STORAGE, useValue: mockPublishStorage },
    { provide: PUBLISHER, useValue: mockPublisher },
  ],
}).compile();
```
See `libs/cap-nest/src/testing/test-helpers.ts` for typed mocks

### CAP Dashboard (Optional Admin UI)
Monitoring and admin tool for message inspection:
```typescript
// apps/cap-test-app/src/app.module.ts
import { CapDashboardModule } from '@cap/cap-dashboard';

CapDashboardModule.forRoot({
  guard: MyAuthGuardProvider,  // REQUIRED - protects admin actions
  routePrefix: '/api/cap',     // REST endpoints base path
  uiRoute: '/cap-dashboard',   // Web UI path
  serveStatic: true,           // Serve built UI assets
})
```
**REST Endpoints** (`/api/cap`):
- `GET /outbox` - List outbox messages (query: `?topic=x&onlyUnpublished=true&full=true`)
- `POST /outbox/:id/retry` - Manual retry (body: `{"force": true}`)
- `POST /outbox/:id/mark-published` - Override status
- `GET /inbox` - List inbox messages (query: `?due=true&full=true`)
- `POST /inbox/:id/retry` - Manual retry handler
- `POST /scheduler/flush-outbox` - Trigger scheduler flush

**Security**: All `POST` actions protected by guard. Use cautiously in production.

**Adapter Requirements**: Works with any storage adapter; efficiency improved with optional methods:
- `findPublishById(id)`, `findReceivedById(id)`
- `listPublish({ limit, offset, topic })`, `listReceived({ limit, offset, topic, due })`

## Critical Implementation Details

- **Immutable messages**: `CapBaseMessage` fields are `readonly`; use object spread for modifications
- **Retry backoff**: `calculateNextRetry(retryCount)` in `backoff.util.ts` - max 5min delay, random jitter prevents thundering herd
- **Scheduler timing**: Outbox flush (30s) faster than inbox retry (1min) to prioritize publishing
- **Validation**: DTOs validated via `class-validator` only if `dto` option provided to `@CapSubscribe`

### Error Handling Patterns

**Outbox failures** (publish errors):
- Transport failures during `publish()` → record left unpublished, no exception thrown
- Scheduler retries unpublished records every 30s indefinitely
- Errors logged with message ID, topic, and full stack trace
- Example: `scheduler.service.ts` catches emit failures, logs error + stack, leaves record for retry

**Inbox failures** (handler errors):
- Handler exceptions caught in `CapService.tryHandle()`
- Automatic retry scheduling via `scheduleRetry(id, retryCount+1, nextRetryTime)`
- Exponential backoff calculated: `expJitter(retryCount)` → next delay
- Logged with correlation ID, retry count, and next retry timestamp
- No max retry limit - continues indefinitely until handler succeeds or manual intervention

**Transaction edge cases**:
- If `publishWithTx(tx, ...)` called but publisher doesn't support transactions → message saved but NOT emitted immediately
- Scheduler picks up after transaction commits
- Prevents duplicate emissions if transaction rolls back

**Validation errors**:
- `CapValidatePipe` throws `BadRequestException` if DTO validation fails
- Inbox message NOT marked as processed - handler never executes
- Retries indefinitely with same validation error unless DTO or message fixed