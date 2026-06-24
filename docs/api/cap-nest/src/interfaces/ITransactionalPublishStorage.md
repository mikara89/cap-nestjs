[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-nest/src](../README.md) / ITransactionalPublishStorage

# Interface: ITransactionalPublishStorage

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:84](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L84)

## Extends

- [`IPublishStorage`](IPublishStorage.md)

## Methods

### claimUnpublished()

> **claimUnpublished**(`options`): `Promise`\<[`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>[]\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:52](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L52)

Atomically claim ready rows for one dispatcher instance.

#### Parameters

##### options

[`ClaimUnpublishedOptions`](ClaimUnpublishedOptions.md)

#### Returns

`Promise`\<[`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>[]\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`claimUnpublished`](IPublishStorage.md#claimunpublished)

***

### findPublishById()?

> `optional` **findPublishById**(`id`): `Promise`\<[`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\> \| `undefined`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:70](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L70)

Optional: find a published record by id (dashboard helpers)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\> \| `undefined`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`findPublishById`](IPublishStorage.md#findpublishbyid)

***

### initialize()?

> `optional` **initialize**(`options?`): `Promise`\<`void`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:49](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L49)

Optional one-time initialization: create schema/tables if needed

#### Parameters

##### options?

[`InitOptions`](InitOptions.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`initialize`](IPublishStorage.md#initialize)

***

### listPublish()?

> `optional` **listPublish**(`opts`): `Promise`\<\{ `items`: [`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>[]; `total?`: `number`; \}\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:73](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L73)

Optional: paginated listing for dashboards and admin UIs

#### Parameters

##### opts

###### limit?

`number`

###### offset?

`number`

###### onlyUnpublished?

`boolean`

###### topic?

`string`

#### Returns

`Promise`\<\{ `items`: [`CapPublishEvent`](CapPublishEvent.md)\<[`JsonValue`](../type-aliases/JsonValue.md)\>[]; `total?`: `number`; \}\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`listPublish`](IPublishStorage.md#listpublish)

***

### markPublished()

> **markPublished**(`id`, `publishedAt?`): `Promise`\<`void`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:57](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L57)

Mark record as successfully emitted to the broker.

#### Parameters

##### id

`string`

##### publishedAt?

`Date`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`markPublished`](IPublishStorage.md#markpublished)

***

### markPublishFailed()

> **markPublishFailed**(`id`, `error`, `options`): `Promise`\<`void`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:60](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L60)

Mark record as retryable failed, or dead-letter when retry limit is exceeded.

#### Parameters

##### id

`string`

##### error

`unknown`

##### options

[`MarkPublishFailedOptions`](MarkPublishFailedOptions.md)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`markPublishFailed`](IPublishStorage.md#markpublishfailed)

***

### releaseExpiredClaims()

> **releaseExpiredClaims**(`now`): `Promise`\<`void`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:67](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L67)

Release processing rows whose lease has expired.

#### Parameters

##### now

`Date`

#### Returns

`Promise`\<`void`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`releaseExpiredClaims`](IPublishStorage.md#releaseexpiredclaims)

***

### savePublish()

> **savePublish**\<`T`\>(`evt`): `Promise`\<`string`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:44](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L44)

Insert a fresh outbox record and return its DB id

#### Type Parameters

##### T

`T` *extends* [`JsonValue`](../type-aliases/JsonValue.md) = [`JsonValue`](../type-aliases/JsonValue.md)

#### Parameters

##### evt

[`CapPublishEvent`](CapPublishEvent.md)\<`T`\>

#### Returns

`Promise`\<`string`\>

#### Inherited from

[`IPublishStorage`](IPublishStorage.md).[`savePublish`](IPublishStorage.md#savepublish)

***

### savePublishWithTx()

> **savePublishWithTx**\<`T`\>(`evt`, `tx`): `Promise`\<`string`\>

Defined in: [cap-nest/src/cap/abstractions/storage.interface.ts:85](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-nest/src/cap/abstractions/storage.interface.ts#L85)

#### Type Parameters

##### T

`T` *extends* [`JsonValue`](../type-aliases/JsonValue.md) = [`JsonValue`](../type-aliases/JsonValue.md)

#### Parameters

##### evt

[`CapPublishEvent`](CapPublishEvent.md)\<`T`\>

##### tx

`unknown`

#### Returns

`Promise`\<`string`\>
