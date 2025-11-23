# CAP Dashboard

This document describes the Cap Dashboard: a small admin module for the CAP Nest
library that provides REST endpoints and a lightweight static admin UI for
inspecting and managing published (outbox) and received (inbox) messages.

Purpose

- List and inspect outbox (published/unpublished) messages.
- List and inspect inbox (received) messages and their retry state.
- Trigger admin actions: manual retry, mark published, mark processed, flush
  scheduler.
- Ship an optional single-file admin UI served by the Nest app.

Quick Summary

- Package: `libs/cap-dashboard`
- Module: `CapDashboardModule`
- REST base path: configurable (default `'/api/cap'`)
- UI path: configurable (default `'/cap-dashboard'`)
- Security: `CapDashboardModule.forRoot` requires a `guard` provider — admin
  actions are protected.

Installation / Enabling

1. Ensure CAP core is registered (example using adapter helpers):

```ts
import { Module } from "@nestjs/common";
import { CapModule } from "@cap/cap-nest";
import { CapDashboardModule } from "@cap/cap-dashboard";
import { MyAuthGuardProvider } from "./auth.guard.provider";
import { StorageAdapterModule } from "@cap/storage-mikro-orm";
import { TransportModule } from "@cap/transport-azure-servicebus";

@Module({
    imports: [
        CapModule.forAdapters(StorageAdapterModule, TransportModule),
        CapDashboardModule.forRoot({
            guard: MyAuthGuardProvider, // REQUIRED
            routePrefix: "/api/cap", // default
            uiRoute: "/cap-dashboard", // default
            serveStatic: true, // default true
            staticAssetsPath: "./public", // relative to library build output
        }),
    ],
})
export class AppModule {}
```

Notes:

- `guard` is required and must be a Nest provider that implements `CanActivate`.
  In tests you can use a mock `useValue: { canActivate: () => true }`.
- If you prefer a separate SPA, set `serveStatic: false` and host the UI
  elsewhere while calling the REST API.

`CapDashboardModule.forRoot` Options

- `routePrefix?: string` — REST endpoint base (default `'/api/cap'`).
- `guard: Provider` — REQUIRED. Provider for an auth guard protecting admin
  actions.
- `pageSizeDefault?: number` — default pagination size.
- `serveStatic?: boolean` — whether to serve built UI assets from the module
  (default `true`).
- `staticAssetsPath?: string` — path to UI files in the built package (default
  `./public`).
- `uiRoute?: string` — URL to mount the UI (default `'/cap-dashboard'`).

REST Endpoints All endpoints are mounted under the `routePrefix` (default
`'/api/cap'`):

- GET `/outbox`
  - Purpose: list outbox messages (published/unpublished)
  - Query params: `page`, `limit`, `topic`, `onlyUnpublished=true`, `full=true`
    (for full payload)
- GET `/outbox/:id`
  - Purpose: get outbox message details
  - Query params: `full=true`
- POST `/outbox/:id/retry`
  - Purpose: manual retry for a single outbox row
  - Body: `{ "force": true | false }` — `force` can bypass duplicate-emission
    checks
  - Protected by guard
- POST `/outbox/:id/mark-published`
  - Purpose: admin override to mark as published without emitting
  - Protected by guard
- GET `/inbox`
  - Purpose: list received/inbox messages
  - Query params: `page`, `limit`, `topic`, `due=true` (nextRetry <= now),
    `full=true`
- GET `/inbox/:id`
  - Purpose: get inbox message details
  - Query params: `full=true`
- POST `/inbox/:id/retry`
  - Purpose: schedule/trigger manual retry of handler
  - Body: `{ "force": true | false }`
  - Protected by guard
- POST `/inbox/:id/mark-processed`
  - Purpose: admin override to mark inbox event as processed
  - Protected by guard
- POST `/scheduler/flush-outbox`
  - Purpose: trigger a manual outbox flush (same semantics as scheduler flush)
  - Protected by guard

Response shapes:

- Paginated list returns
  `{ items: [], total: number, page: number, limit: number }`.
- Item objects include common preview fields (`id`, `topic`, `occurredAt`,
  `payloadPreview`, `retryCount`, `status/processed`, etc.) and optionally
  `payload` if `full=true`.

UI (served from the module)

- The module serves static files from `staticAssetsPath` at `uiRoute` by
  default.
- The built `public/` directory should contain a single-page admin UI that calls
  the REST endpoints. The UI should use the `routePrefix` to make API requests.
- For production, build the UI into `libs/cap-dashboard/src/public` prior to
  packaging; the module will serve these files.

Storage / Adapter Requirements The dashboard is adapter-agnostic but expects the
standard CAP storage tokens:

- Inject `PUBLISH_STORAGE` (type `IPublishStorage`) and call methods like
  `getUnpublished(limit)`, `markPublished(id)`, `savePublish(...)`.
- Inject `RECEIVED_STORAGE` (type `IReceivedStorage`) and call methods like
  `getRetryDue(limit)`, `markProcessed(id)`,
  `scheduleRetry(id, retryCount, nextRetry)`, `saveReceived(...)`.

Recommended optional adapter methods to make the dashboard efficient:

- `findPublishById(id): Promise<CapPublishEvent | undefined>`
- `findReceivedById(id): Promise<CapReceivedEvent | undefined>`
- `listPublish({ limit, offset, topic }): Promise<{ items, total }>`
- `listReceived({ limit, offset, topic, due }): Promise<{ items, total }>`

If the adapter does not provide `findById` or paginated list APIs, the service
will attempt safe fallbacks (duck-typed adapter queries or scanning small
batches) — note: scanning can be inefficient for large datasets.

Concurrency & Safety

- The scheduler may run concurrently with manual admin actions. Admin clients
  should:
  - Use `force` cautiously when retrying to avoid duplicate emits.
  - Prefer `mark-published` or `mark-processed` only when you understand the
    side effects.
- Consider adapter-level idempotency for publishes to avoid duplicates.

Security

- `guard` is required. Use a production-grade auth guard (JWT, OAuth2, or a
  role-check guard).
- Consider separate roles: read-only users vs admin users. The module can be
  extended to accept both guards or to apply guards per-route.

Testing

- Unit tests should mock `PUBLISH_STORAGE` and `RECEIVED_STORAGE` tokens; see
  existing CAP tests for mock patterns.
- For controller tests, provide a mock `guard` provider (e.g.,
  `useValue: { canActivate: () => true }`).
- Integration tests can run against `CapModule.forInMemory()` plus
  `CapDashboardModule.forRoot({ guard: mockGuard })`.

Example: minimal test module setup

```ts
import { Test } from "@nestjs/testing";
import { CapDashboardModule } from "@cap/cap-dashboard";
import { CapModule } from "@cap/cap-nest";

const mockGuard = {
    provide: "MY_GUARD",
    useValue: { canActivate: () => true },
};

const moduleRef = await Test.createTestingModule({
    imports: [
        CapModule.forInMemory(),
        CapDashboardModule.forRoot({
            guard: mockGuard,
            routePrefix: "/api/cap",
        }),
    ],
}).compile();
```

Implementation Roadmap / Next Steps

1. Add `libs/cap-dashboard` scaffold containing module, service, controller,
   DTOs, tests, and `public/` UI.
2. Implement service fallback logic for adapters that lack
   `findById`/pagination.
3. Implement UI in `public/` (or document external SPA).
4. Add optional storage adapter method signatures to
   `IPublishStorage`/`IReceivedStorage` and update adapters gradually.
5. Add docs link from `docs/modules.md` to `docs/cap-dashboard.md`.

Operational Notes

- Payloads can be large — UI should request `full=true` only for single-item
  views; otherwise use `payloadPreview`.
- Consider adding rate-limits for retry endpoints to avoid accidental message
  storms.
