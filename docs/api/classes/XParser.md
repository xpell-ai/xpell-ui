[xpell-ui - v2.0.0-alpha.1](../README.md) / XParser

# Class: XParser

Xpell Parser - Parse XML, HTML, Raw Text & Json to Xpell Command

## Table of contents

### Constructors

- [constructor](XParser.md#constructor)

### Methods

- [addHtml2XpellMapItem](XParser.md#addhtml2xpellmapitem)
- [parse](XParser.md#parse)
- [parseXpellCommand](XParser.md#parsexpellcommand)
- [replaceSpacesInQuotes](XParser.md#replacespacesinquotes)
- [xml2Xpell](XParser.md#xml2xpell)
- [xmlString2Xpell](XParser.md#xmlstring2xpell)
- [xpellify](XParser.md#xpellify)

## Constructors

### constructor

• **new XParser**(): [`XParser`](XParser.md)

#### Returns

[`XParser`](XParser.md)

## Methods

### addHtml2XpellMapItem

▸ **addHtml2XpellMapItem**(`htmlElement`, `xpellElement`): `void`

Adds HTML-Xpell Mapping item

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `htmlElement` | `string` | HTML element to change from |
| `xpellElement` | `string` | Xpell element to change to |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:12

___

### parse

▸ **parse**(`txt`, `module?`): [`XCommand`](XCommand.md)

convert text command to Xpell json command

#### Parameters

| Name | Type |
| :------ | :------ |
| `txt` | `string` |
| `module?` | `string` |

#### Returns

[`XCommand`](XCommand.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:17

___

### parseXpellCommand

▸ **parseXpellCommand**(`command`, `module?`): `Object`

#### Parameters

| Name | Type |
| :------ | :------ |
| `command` | `string` |
| `module?` | `string` |

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `_module` | `undefined` \| `string` |
| `_op` | `undefined` \| `string` |
| `_params` | `any` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:19

___

### replaceSpacesInQuotes

▸ **replaceSpacesInQuotes**(`inputString`, `replaceWith?`): `string`

#### Parameters

| Name | Type |
| :------ | :------ |
| `inputString` | `string` |
| `replaceWith?` | `string` |

#### Returns

`string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:18

___

### xml2Xpell

▸ **xml2Xpell**(`xmlNode`, `forceXhtml?`): `Object`

Converts XML/HTML Document to Xpell JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xmlNode` | `any` | XML Document Node |
| `forceXhtml?` | `boolean` | force Xpell XHTML for every unknown object |

#### Returns

`Object`

Xpell JSON

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:57

___

### xmlString2Xpell

▸ **xmlString2Xpell**(`xmlString`): `Object`

Converts XML/HTML string to XCommand

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xmlString` | `string` | XML string |

#### Returns

`Object`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:50

___

### xpellify

▸ **xpellify**(`XP2Json`): `any`

Covent Xpell2 (XP2) Json to Xpell JSON

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `XP2Json` | `Object` | Xpell 2 JSON |

#### Returns

`any`

**`Deprecated`**

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XParser.d.ts:42
