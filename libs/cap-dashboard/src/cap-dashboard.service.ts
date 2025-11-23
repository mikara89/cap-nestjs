import { Inject, Injectable, Optional, Logger } from '@nestjs/common';
import {
  PUBLISH_STORAGE,
  RECEIVED_STORAGE,
  IPublishStorage,
  IReceivedStorage,
} from '@cap/cap-nest';
import { CapService } from '@cap/cap-nest';
import { IPublisher, PUBLISHER } from '@cap/cap-nest';
import { ListQueryDto } from './dto/list-query.dto';
import { OutboxPageDto } from './dto/page.dto';
import { OutboxItemDto } from './dto/outbox-item.dto';
import { InboxPageDto } from './dto/page.dto';
import { InboxItemDto } from './dto/inbox-item.dto';
import { ActionResultDto } from './dto/action-result.dto';
import { CapPublishEvent } from '@cap/cap-nest';
import { CapReceivedEvent } from '@cap/cap-nest';

const DEFAULT_LIST_LIMIT = 50;

export interface RetryOptions {
  force?: boolean;
}

@Injectable()
export class CapDashboardService {
  private readonly logger = new Logger(CapDashboardService.name);
  constructor(
    @Inject(PUBLISH_STORAGE) private readonly pubStorage: IPublishStorage,
    @Inject(RECEIVED_STORAGE) private readonly recStorage: IReceivedStorage,
    @Optional() private readonly capService?: CapService,
    @Optional() @Inject(PUBLISHER) private readonly publisher?: IPublisher,
  ) {}

  async listOutbox(query: ListQueryDto): Promise<OutboxPageDto> {
    const limit = query?.limit ?? DEFAULT_LIST_LIMIT;
    // Try to use storage.list-like methods if present, otherwise fall back to getUnpublished
    let rows: CapPublishEvent[] = [];
    try {
      if (typeof (this.pubStorage as any).listPublish === 'function') {
        const res = await (this.pubStorage as any).listPublish({
          limit,
          offset: ((query?.page ?? 1) - 1) * limit,
          topic: query?.topic,
        });
        rows = res.items ?? res;
        const total = res.total ?? rows.length;
        return {
          items: rows.map((r) => mapPublishToOutboxDto(r)),
          total,
          page: query?.page ?? 1,
          limit,
        };
      }
    } catch (err) {
      this.logger.warn(
        'listPublish adapter method failed, falling back',
        err as any,
      );
    }

    // fallback
    try {
      rows = await this.pubStorage.getUnpublished(limit);
    } catch (err) {
      this.logger.error('Failed to read outbox rows', err as any);
      rows = [];
    }

    return {
      items: rows.map((r) => mapPublishToOutboxDto(r)),
      total: rows.length,
      page: query?.page ?? 1,
      limit,
    };
  }

  async getOutboxById(
    id: string,
    full = false,
  ): Promise<OutboxItemDto | undefined> {
    // try adapter-specific finder
    try {
      if (typeof (this.pubStorage as any).findPublishById === 'function') {
        const rec = await (this.pubStorage as any).findPublishById(id);
        if (rec) return mapPublishToOutboxDto(rec, full);
      }
    } catch (err) {
      this.logger.warn('findPublishById failed', err as any);
    }

    // fallback: scan small batch
    try {
      const rows = await this.pubStorage.getUnpublished(1000);
      const found = rows.find((r) => r.id === id);
      if (found) return mapPublishToOutboxDto(found, full);
    } catch (err) {
      this.logger.error('Failed to scan outbox for id', err as any);
    }
    return undefined;
  }

  async retryOutbox(id: string, opts?: RetryOptions): Promise<ActionResultDto> {
    try {
      // fetch record
      const rec =
        typeof (this.pubStorage as any).findPublishById === 'function'
          ? await (this.pubStorage as any).findPublishById(id)
          : (await this.pubStorage.getUnpublished(1000)).find(
              (r) => r.id === id,
            );

      if (!rec)
        return { success: false, message: `publish record ${id} not found` };

      if (!this.publisher) {
        return {
          success: false,
          message: 'No publisher available to emit message',
        };
      }

      // attempt emit
      await this.publisher.emit(rec.topic, rec.payload as unknown);

      // mark published on success
      await this.pubStorage.markPublished(id);
      return { success: true, message: 'Published successfully' };
    } catch (err: any) {
      this.logger.error('retryOutbox failed', err);
      return { success: false, message: String(err?.message ?? err) };
    }
  }

  async markOutboxPublished(id: string): Promise<ActionResultDto> {
    try {
      await this.pubStorage.markPublished(id);
      return { success: true };
    } catch (err: any) {
      this.logger.error('markOutboxPublished failed', err);
      return { success: false, message: String(err?.message ?? err) };
    }
  }

  async listInbox(query: ListQueryDto): Promise<InboxPageDto> {
    const limit = query?.limit ?? DEFAULT_LIST_LIMIT;
    // If adapter supports listing, use it
    try {
      if (typeof (this.recStorage as any).listReceived === 'function') {
        const res = await (this.recStorage as any).listReceived({
          limit,
          offset: ((query?.page ?? 1) - 1) * limit,
          topic: query?.topic,
          due: query?.due,
        });
        const rows: CapReceivedEvent[] = res.items ?? res;
        return {
          items: rows.map((r) => mapReceivedToInboxDto(r)),
          total: res.total ?? rows.length,
          page: query?.page ?? 1,
          limit,
        };
      }
    } catch (err) {
      this.logger.warn('listReceived adapter failed, falling back', err as any);
    }

    // fallback: if due requested, use getRetryDue
    let rows: CapReceivedEvent[] = [];
    try {
      if (query?.due) {
        rows = await this.recStorage.getRetryDue(limit);
      } else {
        // No general listing; return empty list to avoid expensive scans
        rows = [];
      }
    } catch (err) {
      this.logger.error('Failed to read inbox rows', err as any);
      rows = [];
    }

    return {
      items: rows.map((r) => mapReceivedToInboxDto(r)),
      total: rows.length,
      page: query?.page ?? 1,
      limit,
    };
  }

  async getInboxById(
    id: string,
    full = false,
  ): Promise<InboxItemDto | undefined> {
    try {
      if (typeof (this.recStorage as any).findReceivedById === 'function') {
        const rec = await (this.recStorage as any).findReceivedById(id);
        if (rec) return mapReceivedToInboxDto(rec, full);
      }
    } catch (err) {
      this.logger.warn('findReceivedById failed', err as any);
    }

    try {
      const rows = await this.recStorage.getRetryDue(1000);
      const found = rows.find((r) => r.id === id);
      if (found) return mapReceivedToInboxDto(found, full);
    } catch (err) {
      this.logger.error('Failed to scan inbox for id', err as any);
    }

    return undefined;
  }

  async retryInbox(id: string, opts?: RetryOptions): Promise<ActionResultDto> {
    try {
      // fetch event
      let rec: CapReceivedEvent | undefined;
      if (typeof (this.recStorage as any).findReceivedById === 'function') {
        rec = await (this.recStorage as any).findReceivedById(id);
      } else {
        const rows = await this.recStorage.getRetryDue(1000);
        rec = rows.find((r) => r.id === id);
      }

      if (!rec)
        return { success: false, message: `received record ${id} not found` };
      if (!this.capService)
        return {
          success: false,
          message: 'CapService not available to retry handler',
        };

      await this.capService.retryReceived(rec);
      return { success: true, message: 'Retry scheduled/executed' };
    } catch (err: any) {
      this.logger.error('retryInbox failed', err);
      return { success: false, message: String(err?.message ?? err) };
    }
  }

  async markInboxProcessed(id: string): Promise<ActionResultDto> {
    try {
      await this.recStorage.markProcessed(id);
      return { success: true };
    } catch (err: any) {
      this.logger.error('markInboxProcessed failed', err);
      return { success: false, message: String(err?.message ?? err) };
    }
  }
}

function mapPublishToOutboxDto(
  evt: CapPublishEvent,
  full = false,
): OutboxItemDto {
  return {
    id: evt.id,
    topic: evt.topic,
    status: evt.status,
    retryCount: evt.retryCount,
    occurredAt: evt.occurredAt ? new Date(evt.occurredAt) : new Date(),
    payloadPreview:
      !full && evt.payload
        ? String(JSON.stringify(evt.payload)).slice(0, 300)
        : undefined,
    payload: full ? evt.payload : undefined,
  };
}

function mapReceivedToInboxDto(
  evt: CapReceivedEvent,
  full = false,
): InboxItemDto {
  return {
    id: evt.id,
    topic: evt.topic,
    processed: evt.processed,
    retryCount: evt.retryCount,
    nextRetry: evt.nextRetry ?? undefined,
    payloadPreview:
      !full && evt.payload
        ? String(JSON.stringify(evt.payload)).slice(0, 300)
        : undefined,
    payload: full ? evt.payload : undefined,
  };
}
