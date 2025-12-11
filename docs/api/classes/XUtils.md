[xpell-ui - v2.0.0-alpha.1](../README.md) / XUtils

# Class: XUtils

## Table of contents

### Constructors

- [constructor](XUtils.md#constructor)

### Methods

- [createIgnoreList](XUtils.md#createignorelist)
- [decode](XUtils.md#decode)
- [encode](XUtils.md#encode)
- [getParam](XUtils.md#getparam)
- [getRandomInt](XUtils.md#getrandomint)
- [guid](XUtils.md#guid)
- [mergeDefaultsWithData](XUtils.md#mergedefaultswithdata)

## Constructors

### constructor

• **new XUtils**(): [`XUtils`](XUtils.md)

#### Returns

[`XUtils`](XUtils.md)

## Methods

### createIgnoreList

▸ **createIgnoreList**(`list`, `reservedWords`): `Object`

create ignore list for parser to ignore spells words

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `list` | `string` | list of reserved words (comma separated) |
| `reservedWords` | `Object` | - |

#### Returns

`Object`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:11

___

### decode

▸ **decode**(`str`): `string`

Decode Base64 String to text

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | Base64 encoded string |

#### Returns

`string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:37

___

### encode

▸ **encode**(`str`): `string`

Encode string to Base-64 format

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `str` | `string` | string to encode |

#### Returns

`string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:31

___

### getParam

▸ **getParam**(`xcmd`, `paramName`, `defaultValue?`): `any`

Extracts parameter from XCommand

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xcmd` | [`XCommand`](XCommand.md) | XCommand object |
| `paramName` | `string` | The name of the parameter to extract |
| `defaultValue?` | `any` | Default value if parameter is not found |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:53

___

### getRandomInt

▸ **getRandomInt**(`min`, `max`): `number`

Returns a random integer between min (inclusive) and max (inclusive).
The value is no lower than min (or the next integer greater than min
if min isn't an integer) and no greater than max (or the next integer
lower than max if max isn't an integer).
Using Math.round() will give you a non-uniform distribution!

#### Parameters

| Name | Type |
| :------ | :------ |
| `min` | `number` |
| `max` | `number` |

#### Returns

`number`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:45

___

### guid

▸ **guid**(): `string`

Generates GUID (Globally unique Identifier)

#### Returns

`string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:18

___

### mergeDefaultsWithData

▸ **mergeDefaultsWithData**(`data`, `defaults`, `force?`): `void`

Merges XDataObject with Defaults object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `IXData` | data of the Xpell command |
| `defaults` | `IXData` | defaults object to merge with |
| `force?` | `boolean` | add defaults values even if exists |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XUtils.d.ts:25
