import { CapSubscriberScanner } from './cap-subscriber.scanner';
import { CAP_SUBSCRIBE_METADATA, CapSubscribe } from '../decorators/cap-subscribe.decorator';

describe('CapSubscriberScanner (integration)', () => {
    it('discovers @CapSubscribe methods and calls CapService.subscribe', () => {
        // create a test class with decorated method
        class ProviderWithHandler {
            @CapSubscribe({ topic: 't.scan', group: 'g-scan' })
            async onMessage(_payload: any) {
                return;
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

        const scanner = new CapSubscriberScanner(modulesContainer as any, reflector as any, capService as any);

        scanner.onModuleInit();

        expect(capService.subscribe).toHaveBeenCalledWith('t.scan', 'g-scan', expect.any(Function));
    });
});
