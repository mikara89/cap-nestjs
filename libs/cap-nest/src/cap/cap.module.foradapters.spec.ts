import { CapModule } from './cap.module';

describe('CapModule.forAdapters', () => {
    it('returns a DynamicModule that includes providers and imports', () => {
        const storageModule = { providers: [{ provide: 'S1', useValue: 1 }] } as any;
        const transportModule = { providers: [{ provide: 'T1', useValue: 2 }] } as any;

        const dm = CapModule.forAdapters(storageModule, transportModule);

        // Should include imports (adapters module + scheduler attach)
        expect(Array.isArray(dm.imports)).toBe(true);
        expect(dm.providers).toBeDefined();
        // Core providers should include CapService
        const provNames = (dm.providers || []).map((p: any) => (p && p.name) || (p && p.provide));
        expect(provNames.some((n: any) => n && (n.toString().includes('CapService') || n === 'CapService'))).toBe(true);
    });
});
