import { Injectable, OnModuleInit, Logger, Scope } from '@nestjs/common';
import { ModulesContainer, Reflector } from '@nestjs/core';
import { CapService } from '../cap.service';
import {
  CAP_SUBSCRIBE_METADATA,
  CapSubscribeOptions,
} from '../decorators/cap-subscribe.decorator';
import { CapValidatePipe } from '../pipes/cap-validate.pipe';

@Injectable({ scope: Scope.DEFAULT }) // one global instance
export class CapSubscriberScanner implements OnModuleInit {
  private readonly log = new Logger(CapSubscriberScanner.name);

  constructor(
    private readonly modules: ModulesContainer, // all loaded modules
    private readonly reflector: Reflector, // read decorator metadata
    private readonly cap: CapService, // facade (storage+transport)
  ) {}

  onModuleInit() {
    // Walk every provider instance in the app
    for (const { providers } of this.modules.values()) {
      for (const wrapper of providers.values()) {
        const { instance } = wrapper;
        if (!instance || typeof instance !== 'object') continue;

        this.registerDecoratedMethods(instance);
      }
    }
  }

  private registerDecoratedMethods(target: object) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const proto = Object.getPrototypeOf(target);
    if (!proto) return;

    const descriptors = Object.getOwnPropertyDescriptors(proto);

    for (const [key, desc] of Object.entries(descriptors)) {
      // skip accessors / non-functions
      if (typeof desc.value !== 'function') continue;

      const meta = this.reflector.get<CapSubscribeOptions | undefined>(
        CAP_SUBSCRIBE_METADATA,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        desc.value,
      );
      if (!meta) continue;

      const { topic, group = '', filter, dto } = meta;

      const pipe = dto ? new CapValidatePipe(dto) : null;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-function-type
      const handler = (desc.value as Function).bind(target);

      this.log.debug(
        `@CapSubscribe → ${target.constructor.name}.${key} ` +
          `(${topic}|${group || 'broadcast'})`,
      );

      this.cap.subscribe(topic, group, async (payload: unknown) => {
        const validated = pipe ? pipe.transform(payload) : payload;
        if (!filter || (await filter(validated))) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          await handler(validated);
        }
      });
    }
  }
}
