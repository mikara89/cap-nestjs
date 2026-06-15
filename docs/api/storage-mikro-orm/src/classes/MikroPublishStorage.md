[**CAP for NestJS API**](../../../README.md)

***

[CAP for NestJS API](../../../README.md) / [storage-mikro-orm/src](../README.md) / MikroPublishStorage

# Class: MikroPublishStorage

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:35](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L35)

## Implements

- `IPublishStorage`

## Constructors

### Constructor

> **new MikroPublishStorage**(`em`, `orm?`): `MikroPublishStorage`

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:38](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L38)

#### Parameters

##### em

`EntityManager`

##### orm?

`MikroORM`\<`IDatabaseDriver`\<`Connection`\>, `EntityManager`\<`IDatabaseDriver`\<`Connection`\>\>\>

#### Returns

`MikroPublishStorage`

## Methods

### claimUnpublished()

> **claimUnpublished**(`options`): `Promise`\<`CapPublishEvent`\<`JsonValue`\>[]\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:85](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L85)

#### Parameters

##### options

`ClaimUnpublishedOptions`

#### Returns

`Promise`\<`CapPublishEvent`\<`JsonValue`\>[]\>

#### Implementation of

`IPublishStorage.claimUnpublished`

***

### findPublishById()

> **findPublishById**(`id`): `Promise`\<`CapPublishEvent`\<`JsonValue`\> \| `undefined`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:154](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L154)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`CapPublishEvent`\<`JsonValue`\> \| `undefined`\>

#### Implementation of

`IPublishStorage.findPublishById`

***

### initialize()?

> `optional` **initialize**(`options?`): `Promise`\<`void`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:43](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L43)

#### Parameters

##### options?

###### autoInit?

`boolean`

###### createSchema?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPublishStorage.initialize`

***

### listPublish()

> **listPublish**(`opts`): `Promise`\<\{ `items`: `CapPublishEvent`\<`JsonValue`\>[]; `total`: `number`; \}\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:161](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L161)

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

`Promise`\<\{ `items`: `CapPublishEvent`\<`JsonValue`\>[]; `total`: `number`; \}\>

#### Implementation of

`IPublishStorage.listPublish`

***

### markPublished()

> **markPublished**(`id`, `publishedAt?`): `Promise`\<`void`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:107](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L107)

#### Parameters

##### id

`string`

##### publishedAt?

`Date` = `...`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPublishStorage.markPublished`

***

### markPublishFailed()

> **markPublishFailed**(`id`, `error`, `options`): `Promise`\<`void`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:118](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L118)

#### Parameters

##### id

`string`

##### error

`unknown`

##### options

`MarkPublishFailedOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPublishStorage.markPublishFailed`

***

### releaseExpiredClaims()

> **releaseExpiredClaims**(`now`): `Promise`\<`void`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:138](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L138)

#### Parameters

##### now

`Date`

#### Returns

`Promise`\<`void`\>

#### Implementation of

`IPublishStorage.releaseExpiredClaims`

***

### savePublish()

> **savePublish**(`event`): `Promise`\<`string`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:69](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L69)

#### Parameters

##### event

`CapPublishEvent`\<`JsonValue`\>

#### Returns

`Promise`\<`string`\>

#### Implementation of

`IPublishStorage.savePublish`

***

### savePublishWithTx()

> **savePublishWithTx**(`event`, `tx`): `Promise`\<`string`\>

Defined in: [storage-mikro-orm/src/storage/mikro-publish-storage.ts:75](https://github.com/mikara89/cap-nestjs/blob/main/libs/storage-mikro-orm/src/storage/mikro-publish-storage.ts#L75)

#### Parameters

##### event

`CapPublishEvent`\<`JsonValue`\>

##### tx

`unknown`

#### Returns

`Promise`\<`string`\>
