export class InboxItemDto {
  id!: string;
  topic!: string;
  processed?: boolean;
  retryCount?: number;
  nextRetry?: Date;
  payloadPreview?: string;
  payload?: unknown;
  headers?: unknown;
}
