import * as expressModule from 'express';
import * as requestModule from 'supertest';
import {
  createInMemoryPublishStorage,
  createInMemoryPublisher,
  createInMemoryReceivedStorage,
  type CapPublishEvent,
} from '@mikara89/cap-core';
import { CapDashboardCoreService } from '@mikara89/cap-dashboard-core';
import { createCapDashboardRouter } from './create-cap-dashboard-router';

const createExpress = expressModule as unknown as () => expressModule.Express;
const request = requestModule as unknown as (app: expressModule.Express) => {
  get(path: string): { expect(status: number): Promise<{ body: unknown }> };
  post(path: string): { expect(status: number): Promise<{ body: unknown }> };
};

describe('createCapDashboardRouter', () => {
  it('lists outbox records', async () => {
    const publishStorage = createInMemoryPublishStorage();
    await publishStorage.savePublish(publishEvent());
    const app = createExpress();
    app.use(
      '/cap',
      createCapDashboardRouter({
        service: new CapDashboardCoreService({
          publishStorage,
          receivedStorage: createInMemoryReceivedStorage(),
        }),
      }),
    );

    const response = await request(app).get('/cap/outbox').expect(200);
    const body = response.body as {
      items: Array<{ id: string; topic: string }>;
    };

    expect(response.body).toEqual(
      expect.objectContaining({
        total: 1,
        page: 1,
        limit: 50,
      }),
    );
    expect(body.items[0]).toEqual(
      expect.objectContaining({
        id: 'outbox-1',
        topic: 'orders.created',
      }),
    );
  });

  it('returns 404 when an item is not found', async () => {
    const app = createExpress();
    app.use(
      '/cap',
      createCapDashboardRouter({
        serviceOptions: {
          publishStorage: createInMemoryPublishStorage(),
          receivedStorage: createInMemoryReceivedStorage(),
          publisher: createInMemoryPublisher(),
        },
      }),
    );

    await request(app).get('/cap/outbox/missing').expect(404);
  });

  it('calls middleware for read routes', async () => {
    const middleware = jest.fn((_req, _res, next) => next());
    const app = createExpress();
    app.use(
      '/cap',
      createCapDashboardRouter({
        serviceOptions: {
          publishStorage: createInMemoryPublishStorage(),
          receivedStorage: createInMemoryReceivedStorage(),
        },
        middleware,
      }),
    );

    await request(app).get('/cap/outbox').expect(200);

    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('calls middleware for write routes', async () => {
    const middleware = jest.fn((_req, _res, next) => next());
    const publishStorage = createInMemoryPublishStorage();
    await publishStorage.savePublish(publishEvent());
    const app = createExpress();
    app.use(
      '/cap',
      createCapDashboardRouter({
        serviceOptions: {
          publishStorage,
          receivedStorage: createInMemoryReceivedStorage(),
        },
        middleware,
      }),
    );

    await request(app).post('/cap/outbox/outbox-1/mark-published').expect(200);

    expect(middleware).toHaveBeenCalledTimes(1);
  });

  it('allows middleware to deny a request', async () => {
    const app = createExpress();
    app.use(
      '/cap',
      createCapDashboardRouter({
        serviceOptions: {
          publishStorage: createInMemoryPublishStorage(),
          receivedStorage: createInMemoryReceivedStorage(),
        },
        middleware: (_req, res) => {
          res.status(401).json({ message: 'Unauthorized' });
        },
      }),
    );

    await request(app).get('/cap/outbox').expect(401);
  });
});

function publishEvent(): CapPublishEvent {
  return {
    id: 'outbox-1',
    topic: 'orders.created',
    occurredAt: '2026-06-16T10:00:00.000Z',
    payload: { orderId: 'order-1' },
    headers: { traceId: 'trace-1' },
    retryCount: 0,
    status: 'pending',
    nextRetryAt: null,
    lastError: null,
    lockedBy: null,
    lockedUntil: null,
    publishedAt: null,
  };
}
