import { type CapPublishOptions } from '../models/cap-options';
import { type CapOperationContext } from '../models/cap-operation-context';

export function resolveOperationContext<TTx>(
  options?: CapPublishOptions<TTx>,
  current?: CapOperationContext<TTx>,
): CapOperationContext<TTx> | undefined {
  if (options?.ctx) return options.ctx;
  if (options && 'tx' in options && options.tx !== undefined) {
    return { tx: options.tx };
  }
  return current;
}
