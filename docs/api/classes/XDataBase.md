[xpell-ui - v2.0.0-alpha.1](../README.md) / \_XDataBase

# Class: \_XDataBase

XDataBase - manage local storage

## Table of contents

### Constructors

- [constructor](XDataBase.md#constructor)

### Accessors

- [encode](XDataBase.md#encode)

### Methods

- [getObject](XDataBase.md#getobject)
- [getString](XDataBase.md#getstring)
- [info](XDataBase.md#info)
- [load](XDataBase.md#load)
- [resetAllData](XDataBase.md#resetalldata)
- [save](XDataBase.md#save)
- [saveObject](XDataBase.md#saveobject)
- [saveString](XDataBase.md#savestring)

## Constructors

### constructor

• **new _XDataBase**(): [`_XDataBase`](XDataBase.md)

#### Returns

[`_XDataBase`](XDataBase.md)

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:17](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L17)

## Accessors

### encode

• `set` **encode**(`value`): `void`

Indicates if the data will be encoded before saving to the local storage

#### Parameters

| Name | Type |
| :------ | :------ |
| `value` | `boolean` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:27](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L27)

## Methods

### getObject

▸ **getObject**(`id`): `any`

Gets a JSON Object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id of the object |

#### Returns

`any`

object (null if not exists)

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:94](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L94)

___

### getString

▸ **getString**(`id`): ``null`` \| `string`

Gets a string value from the data storage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | the id that the string was tagged with |

#### Returns

``null`` \| `string`

<string>

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:73](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L73)

___

### info

▸ **info**(): `void`

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:20](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L20)

___

### load

▸ **load**(`itemName`): ``null`` \| `string`

loads value from local storage

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `itemName` | `string` | @ |

#### Returns

``null`` \| `string`

string

**`Deprecated`**

use getString() function instead

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:49](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L49)

___

### resetAllData

▸ **resetAllData**(): `void`

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:128](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L128)

___

### save

▸ **save**(`itemName`, `item`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `itemName` | `string` |
| `item` | `any` |

#### Returns

`void`

**`Deprecated`**

use saveString instead

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:37](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L37)

___

### saveObject

▸ **saveObject**(`id`, `obj`): `boolean`

Saves an object to the XDB with an ID as a tag (will be used to retrieve the data back)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | id of the object (tag) |
| `obj` | `object` | the object it self |

#### Returns

`boolean`

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:114](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L114)

___

### saveString

▸ **saveString**(`id`, `stringValue`): `void`

Saves a string to the XDB

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `id` | `string` | The id of the string (tag) |
| `stringValue` | `any` | the string value |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:58](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L58)
