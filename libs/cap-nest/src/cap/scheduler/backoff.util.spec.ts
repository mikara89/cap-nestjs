import { expJitter } from './backoff.util';

describe('expJitter', () => {
  it('returns values within expected bounds for attempt 0', () => {
    const base = 1000;
    const max = 5 * 60 * 1000;
    for (let i = 0; i < 20; i++) {
      const v = expJitter(0, base, max);
      expect(v).toBeGreaterThanOrEqual(base);
      expect(v).toBeLessThanOrEqual(base * 2 - 1 + 0); // rand < base
    }
  });

  it('caps at maxMs', () => {
    const v = expJitter(20, 1000, 2000);
    expect(v).toBeLessThanOrEqual(2000);
  });
});
