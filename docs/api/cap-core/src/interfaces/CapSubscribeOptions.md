[**CAP Node.js API**](../../../README.md)

***

[CAP Node.js API](../../../README.md) / [cap-core/src](../README.md) / CapSubscribeOptions

# Interface: CapSubscribeOptions\<T\>

Defined in: [cap-core/src/models/cap-options.ts:9](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/models/cap-options.ts#L9)

## Type Parameters

### T

`T` = `unknown`

## Properties

### dto?

> `optional` **dto?**: () => `T`

Defined in: [cap-core/src/models/cap-options.ts:12](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/models/cap-options.ts#L12)

#### Returns

`T`

***

### filter?

> `optional` **filter?**: (`payload`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [cap-core/src/models/cap-options.ts:13](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/models/cap-options.ts#L13)

#### Parameters

##### payload

`T`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

***

### group?

> `optional` **group?**: `string`

Defined in: [cap-core/src/models/cap-options.ts:11](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/models/cap-options.ts#L11)

***

### topic

> **topic**: `string`

Defined in: [cap-core/src/models/cap-options.ts:10](https://github.com/mikara89/cap-nodejs/blob/main/libs/cap-core/src/models/cap-options.ts#L10)
