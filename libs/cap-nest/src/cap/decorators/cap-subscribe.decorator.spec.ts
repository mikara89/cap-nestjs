/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-argument */

import { CapSubscribe, discoverSubscriptions } from './cap-subscribe.decorator';

describe('CapSubscribe discoverSubscriptions', () => {
  it('discovers decorated methods on an instance', () => {
    class C {
      @CapSubscribe('my.topic', 'g1')
      handler(payload: any) {
        return payload;
      }
    }

    const inst = new C();
    const subs = discoverSubscriptions(inst as any);
    expect(subs.length).toBeGreaterThan(0);
    const s = subs.find((x) => x.topic === 'my.topic');
    expect(s).toBeTruthy();
    expect(typeof s!.handler).toBe('function');
  });
});
