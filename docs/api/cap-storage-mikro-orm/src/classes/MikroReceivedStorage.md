[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-storage-mikro-orm/src](../README.md) / MikroReceivedStorage

# Class: MikroReceivedStorage

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:12](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L12)

## Implements

- [`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md)

## Constructors

### Constructor

> **new MikroReceivedStorage**(`em`, `orm?`, `logger?`): `MikroReceivedStorage`

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:13](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L13)

#### Parameters

##### em

`EntityManager`

##### orm?

`MikroORM`\<`IDatabaseDriver`\<`Connection`\>, `EntityManager`\<`IDatabaseDriver`\<`Connection`\>\>\>

##### logger?

[`CapLogger`](../../../cap-nest/src/interfaces/CapLogger.md)

#### Returns

`MikroReceivedStorage`

## Methods

### findReceivedById()

> **findReceivedById**(`id`): `Promise`\<[`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\> \| `undefined`\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:142](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L142)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<[`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\> \| `undefined`\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`findReceivedById`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#findreceivedbyid)

***

### getRetryDue()

> **getRetryDue**(`limit`): `Promise`\<[`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\>[]\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:125](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L125)

#### Parameters

##### limit

`number`

#### Returns

`Promise`\<[`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\>[]\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`getRetryDue`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#getretrydue)

***

### initialize()?

> `optional` **initialize**(`options?`): `Promise`\<`void`\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:19](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L19)

#### Parameters

##### options?

###### autoInit?

`boolean`

###### createSchema?

`boolean`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`initialize`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#initialize)

***

### listReceived()

> **listReceived**(`opts`): `Promise`\<\{ `items`: [`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\>[]; `total`: `number`; \}\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:149](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L149)

#### Parameters

##### opts

###### due?

`boolean`

###### limit?

`number`

###### offset?

`number`

###### topic?

`string`

#### Returns

`Promise`\<\{ `items`: [`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<[`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)\>[]; `total`: `number`; \}\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`listReceived`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#listreceived)

***

### markProcessed()

> **markProcessed**(`id`): `Promise`\<`void`\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:98](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L98)

#### Parameters

##### id

`string`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`markProcessed`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#markprocessed)

***

### markReceivedFailed()

> **markReceivedFailed**(`id`, `error`, `options`): `Promise`\<`void`\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:108](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L108)

#### Parameters

##### id

`string`

##### error

`unknown`

##### options

`MarkReceivedFailedOptions`

#### Returns

`Promise`\<`void`\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`markReceivedFailed`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#markreceivedfailed)

***

### trySaveReceived()

> **trySaveReceived**\<`T`\>(`event`): `Promise`\<`TrySaveReceivedResult`\<`T`\>\>

Defined in: [cap-storage-mikro-orm/src/storage/mikro-received-storage.ts:45](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-storage-mikro-orm/src/storage/mikro-received-storage.ts#L45)

#### Type Parameters

##### T

`T` *extends* [`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md) = [`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)

#### Parameters

##### event

[`CapReceivedEvent`](../../../cap-nest/src/interfaces/CapReceivedEvent.md)\<`T`\>

#### Returns

`Promise`\<`TrySaveReceivedResult`\<`T`\>\>

#### Implementation of

[`ReceivedStoragePort`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md).[`trySaveReceived`](../../../cap-nest/src/interfaces/ReceivedStoragePort.md#trysavereceived)
