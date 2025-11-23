import { Test, type TestingModule } from '@nestjs/testing';
import { type INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { CapTestAppModule } from './../src/cap-test-app.module';
import { RECEIVED_STORAGE } from '@cap/cap-nest';

describe('Cap Dashboard API (e2e)', () => {
    let app: INestApplication;
    let moduleFixture: TestingModule;

    beforeEach(async () => {
        moduleFixture = await Test.createTestingModule({
            imports: [CapTestAppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    it('GET /api/cap/inbox returns 200 and correct items count', async () => {
        const recStore: any = moduleFixture.get(RECEIVED_STORAGE);

        // ensure a known inbox item exists
        const rec = {
            id: 'e2e-r-1',
            topic: 'e2e.topic',
            group: 'e2e',
            occurredAt: new Date().toISOString(),
            payload: { hello: 'world' },
            retryCount: 0,
            processed: false,
            // set nextRetry in the past so getRetryDue will include it
            nextRetry: new Date(Date.now() - 1000),
        };

        if (typeof recStore.saveReceived === 'function') {
            await recStore.saveReceived(rec);
        }

        const res = await request(app.getHttpServer())
            .get('/api/cap/inbox?page=1&limit=20&due=true')
            .expect(200);

        expect(res.body).toBeDefined();
        // ensure page and items properties exist
        expect(res.body.items).toBeDefined();
        // there should be at least the item we saved
        expect(res.body.items.length).toBeGreaterThanOrEqual(1);
    });
});
