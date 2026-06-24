import {
  ServiceBusPublisher,
  ServiceBusSubscriber,
} from '@mikara89/cap-transport-azure-servicebus';

describe('@mikara89/cap-transport-azure-servicebus root exports', () => {
  it('exposes framework-neutral transport adapters from the package root', () => {
    expect(ServiceBusPublisher).toBeDefined();
    expect(ServiceBusSubscriber).toBeDefined();
  });
});
