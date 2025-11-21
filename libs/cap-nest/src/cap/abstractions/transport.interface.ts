export const PUBLISHER = Symbol('CAP_PUBLISHER');
export const SUBSCRIBER = Symbol('CAP_SUBSCRIBER');

export interface IPublisher {
  emit(topic: string, payload: unknown): Promise<void>;
}
export interface ISubscriber {
  consume(
    topic: string,
    group: string,
    onMessage: (payload: unknown) => Promise<void>,
  ): Promise<void>;
}
