import { resolveOperationContext } from './operation-context.util';

describe('resolveOperationContext', () => {
  it('returns ctx before tx', () => {
    const tx = { id: 'tx' };
    const ctx = { tx: { id: 'ctx' } };

    expect(resolveOperationContext({ tx, ctx })).toBe(ctx);
  });

  it('wraps tx when provided without ctx', () => {
    const tx = { id: 'tx' };

    expect(resolveOperationContext({ tx })).toEqual({ tx });
  });

  it('returns current context as fallback', () => {
    const current = { metadata: { ambient: true } };

    expect(resolveOperationContext(undefined, current)).toBe(current);
  });

  it('does not create a context for undefined tx', () => {
    expect(resolveOperationContext({ tx: undefined })).toBeUndefined();
  });
});
