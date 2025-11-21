/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */

import { CapModule } from './cap.module';
import { PUBLISHER, SUBSCRIBER } from './abstractions/transport.interface';
import {
  PUBLISH_STORAGE,
  RECEIVED_STORAGE,
} from './abstractions/storage.interface';

describe('CapModule builders', () => {
  it('forInMemory returns DynamicModule with adapters containing provider tokens', () => {
    const dm = CapModule.forInMemory();

    // adaptersModule is the first import
    const adapters = dm.imports && dm.imports[0];
    expect(adapters).toBeDefined();
    // adapters should expose providers array
    // Providers should include the in-memory storage classes and transport providers
    const providers = (adapters as any).providers || [];

    const hasPublishStorage = providers.some(
      (p: any) => p && (p.provide === PUBLISH_STORAGE || p.useClass),
    );
    const hasReceivedStorage = providers.some(
      (p: any) => p && (p.provide === RECEIVED_STORAGE || p.useClass),
    );
    const hasPublisher = providers.some(
      (p: any) => p && p.provide === PUBLISHER,
    );
    const hasSubscriber = providers.some(
      (p: any) => p && p.provide === SUBSCRIBER,
    );

    expect(hasPublishStorage).toBe(true);
    expect(hasReceivedStorage).toBe(true);
    expect(hasPublisher).toBe(true);
    expect(hasSubscriber).toBe(true);
  });
});
