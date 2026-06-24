[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-core/src](../README.md) / CapEngineOptions

# Interface: CapEngineOptions

Defined in: [cap-core/src/engine/cap-engine.ts:47](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L47)

## Properties

### idGenerator?

> `optional` **idGenerator?**: () => `string`

Defined in: [cap-core/src/engine/cap-engine.ts:56](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L56)

#### Returns

`string`

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [cap-core/src/engine/cap-engine.ts:54](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L54)

***

### logger?

> `optional` **logger?**: [`CapLogger`](CapLogger.md)

Defined in: [cap-core/src/engine/cap-engine.ts:53](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L53)

***

### now?

> `optional` **now?**: () => `Date`

Defined in: [cap-core/src/engine/cap-engine.ts:55](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L55)

#### Returns

`Date`

***

### publisher

> **publisher**: [`PublisherPort`](PublisherPort.md)

Defined in: [cap-core/src/engine/cap-engine.ts:50](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L50)

***

### publishStorage

> **publishStorage**: [`PublishStoragePort`](PublishStoragePort.md)

Defined in: [cap-core/src/engine/cap-engine.ts:48](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L48)

***

### receivedStorage

> **receivedStorage**: [`ReceivedStoragePort`](ReceivedStoragePort.md)

Defined in: [cap-core/src/engine/cap-engine.ts:49](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L49)

***

### scheduler?

> `optional` **scheduler?**: [`CapSchedulerOptions`](CapSchedulerOptions.md)

Defined in: [cap-core/src/engine/cap-engine.ts:52](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L52)

***

### subscriber

> **subscriber**: [`SubscriberPort`](SubscriberPort.md)

Defined in: [cap-core/src/engine/cap-engine.ts:51](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/engine/cap-engine.ts#L51)
