export interface CapOperationContext<TTx = unknown> {
  tx?: TTx;
  afterCommit?: (fn: () => void | Promise<void>) => void;
  afterRollback?: (fn: (error: unknown) => void | Promise<void>) => void;
  metadata?: Record<string, unknown>;
}
