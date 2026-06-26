import { createInMemoryReceivedStorage } from '@mikara89/cap-core';
import { defineReceivedStorageContract } from './received-storage-contract';

defineReceivedStorageContract(
  'in-memory received storage',
  () =>
    Promise.resolve({
      storage: createInMemoryReceivedStorage(),
      cleanup: () => Promise.resolve(),
    }),
  {
    supportsAtomicInsertIgnore: false,
    supportsSafeConcurrentInsert: false,
  },
);
