[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-dashboard-core/src](../README.md) / CapDashboardCoreService

# Class: CapDashboardCoreService

Defined in: [cap-dashboard-core/src/dashboard.service.ts:53](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L53)

## Constructors

### Constructor

> **new CapDashboardCoreService**(`options`): `CapDashboardCoreService`

Defined in: [cap-dashboard-core/src/dashboard.service.ts:62](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L62)

#### Parameters

##### options

[`CapDashboardCoreServiceOptions`](../interfaces/CapDashboardCoreServiceOptions.md)

#### Returns

`CapDashboardCoreService`

## Methods

### flushOutbox()

> **flushOutbox**(): `Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:230](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L230)

#### Returns

`Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

***

### getInboxById()

> **getInboxById**(`id`, `full?`): `Promise`\<[`InboxItemDto`](InboxItemDto.md) \| `undefined`\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:182](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L182)

#### Parameters

##### id

`string`

##### full?

`boolean` = `false`

#### Returns

`Promise`\<[`InboxItemDto`](InboxItemDto.md) \| `undefined`\>

***

### getOutboxById()

> **getOutboxById**(`id`, `full?`): `Promise`\<[`OutboxItemDto`](OutboxItemDto.md) \| `undefined`\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:100](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L100)

#### Parameters

##### id

`string`

##### full?

`boolean` = `false`

#### Returns

`Promise`\<[`OutboxItemDto`](OutboxItemDto.md) \| `undefined`\>

***

### listInbox()

> **listInbox**(`query`): `Promise`\<[`InboxPageDto`](InboxPageDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:155](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L155)

#### Parameters

##### query

[`ListQueryDto`](ListQueryDto.md)

#### Returns

`Promise`\<[`InboxPageDto`](InboxPageDto.md)\>

***

### listOutbox()

> **listOutbox**(`query`): `Promise`\<[`OutboxPageDto`](OutboxPageDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:72](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L72)

#### Parameters

##### query

[`ListQueryDto`](ListQueryDto.md)

#### Returns

`Promise`\<[`OutboxPageDto`](OutboxPageDto.md)\>

***

### markInboxProcessed()

> **markInboxProcessed**(`id`): `Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:218](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L218)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

***

### markOutboxPublished()

> **markOutboxPublished**(`id`): `Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:143](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L143)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

***

### retryInbox()

> **retryInbox**(`id`, `_opts?`): `Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:195](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L195)

#### Parameters

##### id

`string`

##### \_opts?

[`RetryOptions`](../interfaces/RetryOptions.md)

#### Returns

`Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

***

### retryOutbox()

> **retryOutbox**(`id`, `_opts?`): `Promise`\<[`ActionResultDto`](ActionResultDto.md)\>

Defined in: [cap-dashboard-core/src/dashboard.service.ts:113](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-dashboard-core/src/dashboard.service.ts#L113)

#### Parameters

##### id

`string`

##### \_opts?

[`RetryOptions`](../interfaces/RetryOptions.md)

#### Returns

`Promise`\<[`ActionResultDto`](ActionResultDto.md)\>
