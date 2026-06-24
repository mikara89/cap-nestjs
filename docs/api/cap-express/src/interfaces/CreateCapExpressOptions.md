[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-express/src](../README.md) / CreateCapExpressOptions

# Interface: CreateCapExpressOptions

Defined in: [cap-express/src/create-cap-express.ts:24](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L24)

## Properties

### autoStart?

> `optional` **autoStart?**: `boolean`

Defined in: [cap-express/src/create-cap-express.ts:34](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L34)

***

### idGenerator?

> `optional` **idGenerator?**: () => `string`

Defined in: [cap-express/src/create-cap-express.ts:33](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L33)

#### Returns

`string`

***

### init?

> `optional` **init?**: `InitOptions`

Defined in: [cap-express/src/create-cap-express.ts:35](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L35)

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [cap-express/src/create-cap-express.ts:31](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L31)

***

### logger?

> `optional` **logger?**: [`CapLogger`](../../../cap-nest/src/interfaces/CapLogger.md)

Defined in: [cap-express/src/create-cap-express.ts:30](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L30)

***

### now?

> `optional` **now?**: () => `Date`

Defined in: [cap-express/src/create-cap-express.ts:32](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L32)

#### Returns

`Date`

***

### publisher

> **publisher**: [`PublisherPort`](../../../cap-nest/src/interfaces/PublisherPort.md)

Defined in: [cap-express/src/create-cap-express.ts:27](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L27)

***

### publishStorage

> **publishStorage**: [`PublishStoragePort`](../../../cap-nest/src/interfaces/PublishStoragePort.md)

Defined in: [cap-express/src/create-cap-express.ts:25](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L25)

***

### receivedStorage

> **receivedStorage**: [`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md)

Defined in: [cap-express/src/create-cap-express.ts:26](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L26)

***

### scheduler?

> `optional` **scheduler?**: [`CapExpressSchedulerOptions`](CapExpressSchedulerOptions.md)

Defined in: [cap-express/src/create-cap-express.ts:29](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L29)

***

### subscriber

> **subscriber**: [`SubscriberPort`](../../../cap-nest/src/interfaces/SubscriberPort.md)

Defined in: [cap-express/src/create-cap-express.ts:28](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L28)
