export const PUBLISHER = Symbol('CAP_PUBLISHER');
export const SUBSCRIBER = Symbol('CAP_SUBSCRIBER');
import type { InitOptions } from './initializer.interface';
import type { CapHeaders } from '../models/cap-headers.type';

export interface IPublisher {
  emit(
    topic: string,
    payload: unknown,
    headers?: CapHeaders,
    tx?: unknown,
  ): Promise<void>;
  /** Optional one-time initialization: create queues/topics if needed */
  initialize?(options?: InitOptions): Promise<void>;
}
export interface ISubscriber {
  consume(
    topic: string,
    group: string,
    onMessage: (payload: unknown, headers?: CapHeaders) => Promise<void>,
  ): Promise<void>;
  /** Optional one-time initialization: create queues/topics if needed */
  initialize?(options?: InitOptions): Promise<void>;
}

/** Optional transactional publisher interface. Adapters that can coordinate
 * with a database transaction may implement this to defer or participate
 * in sending messages in the same transactional context. */
export interface ITransactionalPublisher {
  emitWithTx(
    topic: string,
    payload: unknown,
    headers: CapHeaders | undefined,
    tx: unknown,
  ): Promise<void>;
}
