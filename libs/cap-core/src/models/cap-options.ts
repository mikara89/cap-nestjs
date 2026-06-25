import { type CapHeaders } from './cap-headers.type';
import { type CapOperationContext } from './cap-operation-context';

export interface CapPublishOptions<TTx = unknown> {
  headers?: CapHeaders;
  tx?: TTx;
  ctx?: CapOperationContext<TTx>;
  immediate?: boolean;
}

export interface CapSubscribeOptions<T = unknown> {
  topic: string;
  group?: string;
  dto?: new () => T;
  filter?: (payload: T) => boolean | Promise<boolean>;
}

export interface CapSchedulerOptions {
  batchSize?: number;
  leaseMs?: number;
  maxRetries?: number;
  maxInboxRetries?: number;
  instanceId?: string;
  disabled?: boolean;
}
