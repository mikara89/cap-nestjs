import 'reflect-metadata';
import { SetMetadata } from '@nestjs/common';
import { Controller } from '@nestjs/common/interfaces';

/** ----------------------------------------------------------------
 *  Public decorator API
 *  ----------------------------------------------------------------
 */

/**
 * Options recognized by `@CapSubscribe`.
 *
 * * `topic`  – logical topic / exchange / subject.
 * * `group`  – queue / consumer-group name.  Omit if you want a
 *              broadcast queue that every subscriber receives.
 * * `filter` – (optional) user-defined predicate that can short-circuit
 *              delivery before your handler executes.
 */
export interface CapSubscribeOptions<T = unknown> {
  topic: string;
  group?: string;
  dto?: new () => T;
  filter?: (payload: T) => boolean | Promise<boolean>;
}

/**
 * Symbol under which the framework stores metadata.  Exported so
 * helper utilities (e.g. the worker) can reuse the constant without
 * string-literals.
 */
export const CAP_SUBSCRIBE_METADATA = 'CAP_SUBSCRIBE_METADATA';

/**
 * Decorate a *method* so the CAP worker knows it should be invoked
 * when a message on `topic` (optionally `group`) arrives.
 *
 * ```ts
 * @CapSubscribe({ topic: 'user.created', group: 'mail-service' })
 * async handleUserCreated(evt: UserCreated) { … }
 * ```
 */
export function CapSubscribe<T = unknown>(
  opts: CapSubscribeOptions<T> | string,
  maybeGroup?: string,
): MethodDecorator {
  // Support legacy signature  @CapSubscribe('topic','group')
  const normalized: CapSubscribeOptions =
    typeof opts === 'string' ? { topic: opts, group: maybeGroup } : opts;

  return SetMetadata(CAP_SUBSCRIBE_METADATA, normalized);
}

/** ----------------------------------------------------------------
 *  Helper utilities (optional)
 *  ----------------------------------------------------------------
 */

/**
 * Discover every method on an instance that is decorated with
 * `@CapSubscribe` and return an array of runnable subscriptions.
 *
 * ```ts
 * const subs = discoverSubscriptions(serviceInstance);
 * subs.forEach(s =>
 *   capService.subscribe(s.topic, s.group, s.handler, s.filter));
 * ```
 */
export function discoverSubscriptions(
  instance: Controller,
): DiscoveredSubscription[] {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const proto = Object.getPrototypeOf(instance);
  if (!proto) return [];
  return Object.getOwnPropertyNames(proto)
    .filter((key) => typeof instance[key] === 'function')
    .map((key) => {
      // Try multiple metadata locations: method (descriptor value), prototype property, or instance property
      // This mirrors how Nest's SetMetadata/Reflector may attach metadata.
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      const fn = proto[key] ?? instance[key];
      // Try metadata on the function itself (common when SetMetadata applied to method)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const meta =
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Reflect.getMetadata(CAP_SUBSCRIBE_METADATA, fn) ||
        // Fallback to metadata on the instance property (older patterns)
        Reflect.getMetadata(CAP_SUBSCRIBE_METADATA, instance, key) ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        Reflect.getMetadata(CAP_SUBSCRIBE_METADATA, proto, key);

      if (!meta) return undefined;
      return {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        topic: meta.topic,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        group: meta.group ?? undefined,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment
        filter: meta.filter,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        handler: (fn as (...args: unknown[]) => unknown).bind(instance),
      } as DiscoveredSubscription;
    })
    .filter(Boolean) as DiscoveredSubscription[];
}

/** Shape returned by `discoverSubscriptions` */
export interface DiscoveredSubscription {
  topic: string;
  group?: string;
  filter?: (payload: unknown) => boolean | Promise<boolean>;
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  handler: (payload: unknown) => unknown | Promise<unknown>;
}
