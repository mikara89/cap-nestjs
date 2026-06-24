# Package Export Surface

CAP packages use classic CommonJS package metadata with `main` and `types`.
Adapter packages that contain optional framework wrappers expose those wrappers
through explicit subpaths so package roots stay framework-neutral.

## Supported Public Imports

Use package-root imports:

```ts
import { CapEngine } from '@mikara89/cap-core';
import { CapModule, CapService, CapSubscribe } from '@mikara89/cap-nest';
import { createTestCapEngine } from '@mikara89/cap-testing';
import { createCapExpress } from '@mikara89/cap-express';
import { MikroPublishStorage } from '@mikara89/cap-storage-mikro-orm';
import { MikroStorageModule } from '@mikara89/cap-storage-mikro-orm/nest';
import { ServiceBusPublisher } from '@mikara89/cap-transport-azure-servicebus';
import { ServiceBusTransportModule } from '@mikara89/cap-transport-azure-servicebus/nest';
import { NestjsMicroservicesTransportModule } from '@mikara89/cap-transport-nestjs-microservices';
import { CapDashboardModule } from '@mikara89/cap-dashboard-nest';
import { createCapDashboardRouter } from '@mikara89/cap-dashboard-express';
```

The supported package roots are:

- `@mikara89/cap-core`
- `@mikara89/cap-nest`
- `@mikara89/cap-testing`
- `@mikara89/cap-express`
- `@mikara89/cap-storage-mikro-orm`
- `@mikara89/cap-transport-azure-servicebus`
- `@mikara89/cap-transport-nestjs-microservices`
- `@mikara89/cap-dashboard-core`
- `@mikara89/cap-dashboard-nest`
- `@mikara89/cap-dashboard-express`
- `@mikara89/cap-dashboard`

`@mikara89/cap-dashboard` remains supported as a compatibility alias for the
Nest dashboard package root.

Nest wrapper subpaths are supported for packages that also have framework-free
runtime adapters:

- `@mikara89/cap-storage-mikro-orm/nest`
- `@mikara89/cap-storage-mikro-orm/nest/mikro-storage.module`
- `@mikara89/cap-transport-azure-servicebus/nest`
- `@mikara89/cap-transport-azure-servicebus/nest/servicebus-transport.module`

Nest peer dependencies for those adapter packages are required only when using
the `/nest` exports.

## Unsupported Deep Imports

Imports from package internals are not part of the public API:

```ts
// Avoid: internal path, not covered by compatibility guarantees.
import { CapService } from '@mikara89/cap-nest/dist/cap/cap.service';
```

Internal folder layout can change before package `exports` maps are introduced.
If an internal symbol is useful to applications, promote it through the package
root before documenting it.

## Follow-Up Decision

Keep package `exports` maps narrow and compatibility-aware. The expected shape
is:

- root `.` export for every package;
- explicit framework wrapper exports such as `./nest`;
- optional `./testing` export for `@mikara89/cap-nest` only if testing helpers are
  intentionally supported for consumers.
