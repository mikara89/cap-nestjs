/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/require-await, @typescript-eslint/no-unsafe-argument */

import { CapService } from './cap.service';

describe('CapService (unit)', () => {
  let cap: CapService;

  let pubStore: any;
  let recStore: any;
  let publisher: any;
  let subscriber: any;

  beforeEach(() => {
    pubStore = {
      savePublish: jest.fn().mockResolvedValue('db1'),
      markPublished: jest.fn().mockResolvedValue(undefined),
      getUnpublished: jest.fn().mockResolvedValue([]),
    };

    recStore = {
      saveReceived: jest.fn().mockImplementation(async (e) => e.id),
      markProcessed: jest.fn().mockResolvedValue(undefined),
      getRetryDue: jest.fn().mockResolvedValue([]),
      scheduleRetry: jest.fn().mockResolvedValue(undefined),
    };

    // publisher just records calls, can be made to throw in tests
    publisher = { emit: jest.fn().mockResolvedValue(undefined) };

    // subscriber stores handlers so tests can trigger them
    const handlers = new Map<string, any>();
    subscriber = {
      consume: jest
        .fn()
        .mockImplementation(
          async (topic: string, group: string, onMessage: any) => {
            handlers.set(`${topic}|${group}`, onMessage);
            return Promise.resolve();
          },
        ),
      __trigger: (topic: string, group: string, payload: any) => {
        const fn = handlers.get(`${topic}|${group}`);
        if (!fn) throw new Error('no handler');
        return fn(payload);
      },
    };

    cap = new CapService(pubStore, recStore, publisher, subscriber);
  });

  it('publish - success marks published', async () => {
    await cap.publish('t1', { a: 1 });

    expect(pubStore.savePublish).toHaveBeenCalled();
    expect(publisher.emit).toHaveBeenCalledWith('t1', { a: 1 });
    expect(pubStore.markPublished).toHaveBeenCalled();
  });

  it('publish - transport failure leaves unpublished', async () => {
    publisher.emit.mockRejectedValueOnce(new Error('boom'));

    await cap.publish('t2', { b: 2 });

    expect(pubStore.savePublish).toHaveBeenCalled();
    expect(publisher.emit).toHaveBeenCalledWith('t2', { b: 2 });
    expect(pubStore.markPublished).not.toHaveBeenCalled();
  });

  it('subscribe - handler processed successfully and persisted', async () => {
    const handler = jest.fn(async () => {
      // simulate processing
      return Promise.resolve();
    });

    // attach a handler using cap.subscribe
    cap.subscribe('topic-x', 'group-1', handler);

    // trigger the subscriber's onMessage
    await subscriber.__trigger('topic-x', 'group-1', { foo: 'bar' });

    // persisted and processed
    expect(recStore.saveReceived).toHaveBeenCalled();
    expect(recStore.markProcessed).toHaveBeenCalled();
    expect(handler).toHaveBeenCalledWith({ foo: 'bar' });
  });

  it('subscribe - handler failure schedules retry', async () => {
    const handler = jest.fn(async () => {
      throw new Error('handler fail');
    });

    cap.subscribe('topic-retry', 'group-r', handler);

    await subscriber.__trigger('topic-retry', 'group-r', { z: 9 });

    expect(recStore.saveReceived).toHaveBeenCalled();
    // after failure, scheduleRetry should be called
    expect(recStore.scheduleRetry).toHaveBeenCalled();
    const args = recStore.scheduleRetry.mock.calls[0];
    // args: id, retryCount, nextRetry(Date)
    expect(typeof args[0]).toBe('string');
    expect(args[1]).toBe(1);
    expect(args[2] instanceof Date).toBe(true);
  });
});
