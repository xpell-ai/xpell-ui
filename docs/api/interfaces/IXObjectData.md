[xpell-ui - v2.0.0-alpha.1](../README.md) / IXObjectData

# Interface: IXObjectData

XObject constructor data interface
 IXObjectData

**`Param`**

minimum Xpell interpreter version (optional default value is 1.0)

**`Deprecated`**

use XObjectData type instead instead

## Hierarchy

- [`IXData`](IXData.md)

  ↳ **`IXObjectData`**

## Indexable

▪ [k: `string`]: `string` \| ``null`` \| [] \| `undefined` \| `Function` \| `boolean` \| `number` \| {}

## Table of contents

### Properties

- [\_children](IXObjectData.md#_children)
- [\_data\_source](IXObjectData.md#_data_source)
- [\_id](IXObjectData.md#_id)
- [\_name](IXObjectData.md#_name)
- [\_on](IXObjectData.md#_on)
- [\_on\_create](IXObjectData.md#_on_create)
- [\_on\_data](IXObjectData.md#_on_data)
- [\_on\_frame](IXObjectData.md#_on_frame)
- [\_on\_mount](IXObjectData.md#_on_mount)
- [\_process\_data](IXObjectData.md#_process_data)
- [\_process\_frame](IXObjectData.md#_process_frame)
- [\_type](IXObjectData.md#_type)

## Properties

### \_children

• `Optional` **\_children**: ([`XObject`](../classes/XObject.md) \| [`XObjectData`](../README.md#xobjectdata))[]

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:23

___

### \_data\_source

• `Optional` **\_data\_source**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:25

___

### \_id

• `Optional` **\_id**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:21

___

### \_name

• `Optional` **\_name**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:24

___

### \_on

• `Optional` **\_on**: [`XObjectOnEventIndex`](XObjectOnEventIndex.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:26

___

### \_on\_create

• `Optional` **\_on\_create**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:27

___

### \_on\_data

• `Optional` **\_on\_data**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:30

___

### \_on\_frame

• `Optional` **\_on\_frame**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:29

___

### \_on\_mount

• `Optional` **\_on\_mount**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:28

___

### \_process\_data

• `Optional` **\_process\_data**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:32

___

### \_process\_frame

• `Optional` **\_process\_frame**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:31

___

### \_type

• **\_type**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:22
