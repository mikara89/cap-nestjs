# CAP NestJS Library - Copilot Instructions

## Project Overview

This is a **Cloud Access Pattern (CAP)** library implementation for NestJS that provides reliable message handling through outbox/inbox patterns with automatic retry mechanisms. The library abstracts storage and transport layers using dependency injection.

## Architecture

### Core Components
- **`CapService`** - Main facade orchestrating storage and transport
- **Outbox Pattern** - Reliable message publishing with retry (`PUBLISH_STORAGE`)
- **Inbox Pattern** - Reliable message consumption with retry (`RECEIVED_STORAGE`) 
- **Transport Abstraction** - Publisher/Subscriber interfaces (`PUBLISHER`, `SUBSCRIBER`)
- **Scheduler** - Cron-based retry mechanism for failed messages (30s outbox, 1min inbox)

### Key Abstractions
- Storage interfaces in `abstractions/storage.interface.ts` use **Symbol tokens** for IoC
- Transport interfaces in `abstractions/transport.interface.ts` for message bus abstraction
- All messages extend `CapBaseMessage` with immutable design principle

## Development Patterns

### Message Handler Registration
Use `@CapSubscribe` decorator on methods:
```typescript
@CapSubscribe({ topic: 'user.created', group: 'mail-service', dto: UserCreatedDto })
async handleUserCreated(payload: UserCreatedDto) { ... }
```

### Module Configuration
Three configuration approaches:
- `CapModule.forInMemory()` - Built-in test setup
- `CapModule.forAdapters(storageModule, transportModule)` - Adapter-based
- `CapModule.forRoot({ storage: [...], transport: [...] })` - Raw providers

### Retry Strategy
- **Exponential backoff with jitter** in `scheduler/backoff.util.ts`
- Formula: `min(baseMs * 2^attempt + random(baseMs), maxMs)`
- Default: 1s base delay, 5min cap, random jitter to prevent thundering herd
- Outbox retries every 30s (`@Cron(CronExpression.EVERY_30_SECONDS)`)
- Inbox retries every 1min (`@Cron(CronExpression.EVERY_MINUTE)`)
- Automatic retry scheduling via `scheduleRetry()` in storage interfaces

## Monorepo Structure

- **`libs/cap-nest/`** - Core library with public exports in `index.ts`
- **`apps/cap-test-app/`** - Test application (currently minimal)
- **Module alias**: `@cap/cap-nest` maps to `libs/cap-nest/src`

## Development Workflow

### Testing Requirements
- **Always write unit tests before implementing new features**
- Test files use `.spec.ts` suffix
- Place tests alongside implementation files
- Use Jest with ts-jest for TypeScript support
- Mock Symbol-based dependencies using NestJS testing utilities

### Testing
```bash
npm test              # Unit tests
npm run test:e2e      # E2E tests  
npm run test:cov      # Coverage
```

### Building & Running
```bash
npm run build         # Compile TypeScript
npm run start:dev     # Watch mode development
npm run start:prod    # Production mode
```

### Code Quality
- **ESLint + Prettier** with TypeScript strict rules
- Use `npm run lint` to fix style issues
- Use `npm run format` to format code

## Key Implementation Details

### Scanner Pattern
`CapSubscriberScanner` automatically discovers `@CapSubscribe` decorated methods on module initialization using NestJS reflection (`ModulesContainer`, `Reflector`).

### Error Handling
- Messages persist **before** transport attempts (outbox pattern)
- Failed handlers trigger retry scheduling with exponential backoff
- Outbox failures: Left unpublished, retried every 30s by scheduler
- Inbox failures: `scheduleRetry()` updates `retryCount` and `nextRetry` timestamp
- Detailed logging with correlation IDs and error stack traces for tracing

### Validation Pipeline
Optional DTO validation via `CapValidatePipe` using `class-validator`/`class-transformer`.

## Integration Points

- **NestJS Schedule** - Powers cron-based retry mechanisms
- **Symbol-based IoC** - Clean abstraction boundaries for adapters
- **Reflection API** - Automatic handler discovery and registration

When extending this library, implement storage/transport adapters by providing the required Symbol tokens (`PUBLISH_STORAGE`, `RECEIVED_STORAGE`, `PUBLISHER`, `SUBSCRIBER`) in your adapter modules.

---

## 🚧 Unit Test Coverage Plan (WIP - Remove when complete)

### Missing Unit Tests
- [x] `libs/cap-nest/src/cap/cap.service.spec.ts`
  - [x] `publish()` - save to storage, emit via transport, mark published
  - [x] `publish()` - handle transport failure (leave unpublished)
  - [x] `subscribe()` - register handler and attach to subscriber
  - [x] `retryReceived()` - execute handler with retry logic
  - [x] `tryHandle()` - mark processed on success
  - [x] `tryHandle()` - schedule retry on failure with exponential backoff
  
- [ ] `libs/cap-nest/src/cap/scanner/cap-subscriber.scanner.spec.ts`
  - [x] Discover @CapSubscribe decorated methods (scanner integration)
  - [x] Register handlers with `CapService`
  - [x] Apply DTO validation when configured
  - [x] Apply filter predicate when provided

- [x] `libs/cap-nest/src/cap/decorators/cap-subscribe.decorator.spec.ts`
  - [x] Discover @CapSubscribe decorated methods (helper `discoverSubscriptions`)

- [x] `libs/cap-nest/src/cap/scheduler/schedule.service.spec.ts`
  - [x] `flushOutbox()` - retry unpublished messages
  - [x] `flushOutbox()` - mark published on success
  - [x] `flushOutbox()` - leave unpublished on failure
  - [x] `retryInbox()` - fetch and retry due messages

- [x] `libs/cap-nest/src/cap/scheduler/backoff.util.spec.ts`
  - [x] Exponential backoff calculation
  - [x] Jitter randomization
  - [x] Max delay cap enforcement

- [x] `libs/cap-nest/src/cap/pipes/cap-validate.pipe.spec.ts`
  - [x] Transform and validate DTO
  - [x] Throw BadRequestException on validation errors

- [x] `libs/cap-nest/src/cap/cap.module.spec.ts`
  - [x] `forRoot()` - wire up providers correctly (basic checks)
  - [x] `forAdapters()` - extract providers from adapter modules
  - [x] `forInMemory()` - provide in-memory implementations