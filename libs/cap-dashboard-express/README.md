# @mikara89/cap-dashboard-express

Express router adapter for the framework-agnostic CAP dashboard service.

```ts
import { createCapDashboardRouter } from '@mikara89/cap-dashboard-express';

app.use(
  '/cap',
  createCapDashboardRouter({
    service,
    middleware: requireAuthenticatedOperator,
  }),
);
```

Dashboard routes must be protected before production exposure. The no-auth
setup is for local development only, because mutation endpoints can retry or
alter message state.
