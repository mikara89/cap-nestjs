import { CapSubscriberScanner } from './cap-subscriber.scanner';
import { CapSubscribe } from '../decorators/cap-subscribe.decorator';
/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

describe('CapSubscriberScanner (integration)', () => {
  it('discovers @CapSubscribe methods and calls CapService.subscribe', () => {
    // create a test class with decorated method
    class ProviderWithHandler {
      @CapSubscribe({ topic: 't.scan', group: 'g-scan' })
      onMessage(): Promise<void> {
        return Promise.resolve();
      }
    }

    const inst = new ProviderWithHandler();

    // fake ModulesContainer: Map with one module value containing providers Map
    const providersMap = new Map();
    providersMap.set('pw', { instance: inst });

    const modulesContainer = new Map();
    modulesContainer.set('mod', { providers: providersMap });

    // simple Reflector shim that reads Reflect metadata
    const reflector = {
      get: (key: string, target: any) => Reflect.getMetadata(key, target),
    } as any;

    const capService = { subscribe: jest.fn() } as any;

    const scanner = new CapSubscriberScanner(
      modulesContainer as any,
      reflector,
      capService,
    );

    scanner.onModuleInit();

    expect(capService.subscribe).toHaveBeenCalledWith(
      't.scan',
      'g-scan',
      expect.any(Function),
    );
  });
});
