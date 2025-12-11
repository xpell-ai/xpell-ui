[xpell-ui - v2.0.0-alpha.1](../README.md) / \_XData

# Class: \_XData

## Table of contents

### Constructors

- [constructor](XData.md#constructor)

### Properties

- [objects](XData.md#objects)
- [variables](XData.md#variables)

### Accessors

- [\_o](XData.md#_o)

### Methods

- [clean](XData.md#clean)
- [delete](XData.md#delete)
- [has](XData.md#has)
- [pick](XData.md#pick)
- [set](XData.md#set)

## Constructors

### constructor

• **new _XData**(): [`_XData`](XData.md)

#### Returns

[`_XData`](XData.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:24

## Properties

### objects

• **objects**: [`XDataObject`](../README.md#xdataobject)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:22

___

### variables

• **variables**: [`XDataVariable`](../README.md#xdatavariable)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:23

## Accessors

### \_o

• `get` **_o**(): [`XDataObject`](../README.md#xdataobject)

This method gets the XData object

#### Returns

[`XDataObject`](../README.md#xdataobject)

XDataObject object

**`Example`**

```ts
// get the XDataObject object
 const o = XData._o["my-object-id"]
 // set the XDataObject object
 XData._o["my-object-id"] = {my:"object"}
```

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:34

## Methods

### clean

▸ **clean**(): `void`

This method cleans the XData Memory

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:63

___

### delete

▸ **delete**(`objectId`): `void`

Deletes an object from the XData object

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:53

___

### has

▸ **has**(`objectId`): `boolean`

This method checks if the XData object has an object by id

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`boolean`

boolean

**`Comment`**

It is also possible to query the XData._o property -> if(XData._o["my-object-id"])...

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:48

___

### pick

▸ **pick**(`objectId`): `any`

Gets an object and delete it from the XData object list

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:59

___

### set

▸ **set**(`objectId`, `object`): `void`

This method adds an object to the XData object

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |
| `object` | `any` |

#### Returns

`void`

**`Comment`**

It is also possible to use the XData._o property -> XData._o["my-object-id"] = {my:"object"}

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:41
