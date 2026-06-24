import {
  MikroPublishStorage,
  MikroReceivedStorage,
} from '@mikara89/cap-storage-mikro-orm';

describe('@mikara89/cap-storage-mikro-orm root exports', () => {
  it('exposes framework-neutral storage adapters from the package root', () => {
    expect(MikroPublishStorage).toBeDefined();
    expect(MikroReceivedStorage).toBeDefined();
  });
});
