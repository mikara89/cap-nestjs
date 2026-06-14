import { CapHeaders } from './cap-headers.decorator';
import { CapSubscribe, discoverSubscriptions } from './cap-subscribe.decorator';

describe('CapSubscribe discoverSubscriptions', () => {
  it('discovers decorated methods on an instance', () => {
    class C {
      @CapSubscribe('my.topic', 'g1')
      handler(payload: unknown) {
        return payload;
      }
    }

    const inst = new C();
    const subs = discoverSubscriptions(inst);
    expect(subs.length).toBeGreaterThan(0);
    const s = subs.find((x) => x.topic === 'my.topic');
    expect(s).toBeTruthy();
    expect(typeof s!.handler).toBe('function');
  });

  it('injects headers into the decorated parameter', async () => {
    const seen: unknown[] = [];

    class C {
      @CapSubscribe('my.topic', 'g1')
      handler(payload: unknown, @CapHeaders() headers: unknown) {
        seen.push(payload, headers);
      }
    }

    const inst = new C();
    const [sub] = discoverSubscriptions(inst);

    await sub.handler({ id: 1 }, { traceId: 'abc' });

    expect(seen).toEqual([{ id: 1 }, { traceId: 'abc' }]);
  });
});
