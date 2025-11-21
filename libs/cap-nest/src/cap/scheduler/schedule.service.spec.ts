import { RetrySchedulerService } from './schedule.service';

describe('RetrySchedulerService', () => {
    let svc: RetrySchedulerService;
    let pubStore: any;
    let publisher: any;
    let recStore: any;
    let cap: any;

    beforeEach(() => {
        pubStore = {
            getUnpublished: jest.fn().mockResolvedValue([]),
            markPublished: jest.fn().mockResolvedValue(undefined),
        };

        publisher = {
            emit: jest.fn().mockResolvedValue(undefined),
        };

        recStore = {
            getRetryDue: jest.fn().mockResolvedValue([]),
        };

        cap = { retryReceived: jest.fn().mockResolvedValue(undefined) };

        svc = new RetrySchedulerService(pubStore, publisher, recStore, cap);
    });

    it('flushOutbox publishes unpublished messages and marks published', async () => {
        const evt = { id: '1', topic: 't', payload: { a: 1 } };
        pubStore.getUnpublished.mockResolvedValueOnce([evt]);

        await svc.flushOutbox();

        expect(publisher.emit).toHaveBeenCalledWith('t', { a: 1 });
        expect(pubStore.markPublished).toHaveBeenCalledWith('1');
    });

    it('flushOutbox leaves record when publish fails', async () => {
        const evt = { id: '2', topic: 't2', payload: {} };
        pubStore.getUnpublished.mockResolvedValueOnce([evt]);
        publisher.emit.mockRejectedValueOnce(new Error('net'));

        await svc.flushOutbox();

        // markPublished should not be called on failure
        expect(pubStore.markPublished).not.toHaveBeenCalled();
    });

    it('retryInbox calls cap.retryReceived for due messages', async () => {
        const rec = { id: 'r1', topic: 'x', group: 'g' };
        recStore.getRetryDue.mockResolvedValueOnce([rec]);

        await svc.retryInbox();

        expect(cap.retryReceived).toHaveBeenCalledWith(rec);
    });
});
