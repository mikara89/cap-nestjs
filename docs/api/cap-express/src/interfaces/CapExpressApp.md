[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-express/src](../README.md) / CapExpressApp

# Interface: CapExpressApp

Defined in: [cap-express/src/create-cap-express.ts:38](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L38)

## Properties

### engine

> **engine**: [`CapEngine`](../../../cap-nest/src/classes/CapEngine.md)

Defined in: [cap-express/src/create-cap-express.ts:39](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L39)

***

### schedulerRunning

> `readonly` **schedulerRunning**: `boolean`

Defined in: [cap-express/src/create-cap-express.ts:53](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L53)

## Methods

### healthRouter()

> **healthRouter**(): `Router`

Defined in: [cap-express/src/create-cap-express.ts:52](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L52)

#### Returns

`Router`

***

### publish()

> **publish**\<`T`\>(`topic`, `payload`, `options?`): `Promise`\<`void`\>

Defined in: [cap-express/src/create-cap-express.ts:40](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L40)

#### Type Parameters

##### T

`T` *extends* [`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md) = [`JsonValue`](../../../cap-nest/src/type-aliases/JsonValue.md)

#### Parameters

##### topic

`string`

##### payload

`T`

##### options?

[`CapPublishOptions`](../../../cap-nest/src/interfaces/CapPublishOptions.md)

#### Returns

`Promise`\<`void`\>

***

### start()

> **start**(): `Promise`\<`void`\>

Defined in: [cap-express/src/create-cap-express.ts:50](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L50)

#### Returns

`Promise`\<`void`\>

***

### stop()

> **stop**(): `Promise`\<`void`\>

Defined in: [cap-express/src/create-cap-express.ts:51](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L51)

#### Returns

`Promise`\<`void`\>

***

### subscribe()

> **subscribe**\<`T`\>(`topic`, `group`, `handler`): `Promise`\<`void`\>

Defined in: [cap-express/src/create-cap-express.ts:45](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-express/src/create-cap-express.ts#L45)

#### Type Parameters

##### T

`T` = `unknown`

#### Parameters

##### topic

`string`

##### group

`string`

##### handler

(`payload`, `headers?`) => `Promise`\<`void`\>

#### Returns

`Promise`\<`void`\>
