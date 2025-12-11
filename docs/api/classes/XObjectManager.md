[xpell-ui - v2.0.0-alpha.1](../README.md) / XObjectManager

# Class: XObjectManager

## Table of contents

### Constructors

- [constructor](XObjectManager.md#constructor)

### Accessors

- [\_classes](XObjectManager.md#_classes)
- [\_objects](XObjectManager.md#_objects)

### Methods

- [addObject](XObjectManager.md#addobject)
- [getAllClasses](XObjectManager.md#getallclasses)
- [getObject](XObjectManager.md#getobject)
- [getObjectByName](XObjectManager.md#getobjectbyname)
- [getObjectClass](XObjectManager.md#getobjectclass)
- [go](XObjectManager.md#go)
- [hasObject](XObjectManager.md#hasobject)
- [hasObjectClass](XObjectManager.md#hasobjectclass)
- [registerObject](XObjectManager.md#registerobject)
- [registerObjects](XObjectManager.md#registerobjects)
- [removeObject](XObjectManager.md#removeobject)

## Constructors

### constructor

• **new XObjectManager**(): [`XObjectManager`](XObjectManager.md)

#### Returns

[`XObjectManager`](XObjectManager.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:12

## Accessors

### \_classes

• `get` **_classes**(): `XObjectManagerIndex`

#### Returns

`XObjectManagerIndex`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:48

___

### \_objects

• `get` **_objects**(): `XObjectManagerIndex`

#### Returns

`XObjectManagerIndex`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:13

## Methods

### addObject

▸ **addObject**(`xObject`): `void`

Add XObject instance to the manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObject` | [`XObject`](XObject.md) | XObject to maintain |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:53

___

### getAllClasses

▸ **getAllClasses**(): `XObjectManagerIndex`

Retrieves all the classes dictionary

#### Returns

`XObjectManagerIndex`

XObjectManagerIndex

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:47

___

### getObject

▸ **getObject**(`xObjectId`): [`XObject`](XObject.md)

Retrieves XObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObjectId` | `string` | XObject id |

#### Returns

[`XObject`](XObject.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:64

___

### getObjectByName

▸ **getObjectByName**(`objectName`): ``null`` \| [`XObject`](XObject.md)

Retrieves XObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectName` | `string` | XObject name |

#### Returns

``null`` \| [`XObject`](XObject.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:76

___

### getObjectClass

▸ **getObjectClass**(`name`): `any`

Retrieves XObject class instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | class name |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:42

___

### go

▸ **go**(`id`): [`XObject`](XObject.md)

alias to getObject

#### Parameters

| Name | Type |
| :------ | :------ |
| `id` | `string` |

#### Returns

[`XObject`](XObject.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:70

___

### hasObject

▸ **hasObject**(`xObjectId`): `boolean`

Checks if an object is found in the object manager

#### Parameters

| Name | Type |
| :------ | :------ |
| `xObjectId` | `string` |

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:19

___

### hasObjectClass

▸ **hasObjectClass**(`name`): `boolean`

Checks if a class (name) is found in the object manager classes dictionary

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | class name |

#### Returns

`boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:36

___

### registerObject

▸ **registerObject**(`name`, `xObjects`): `void`

Registers single XObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `string` | name of the object |
| `xObjects` | [`XObject`](XObject.md) | The object class |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:30

___

### registerObjects

▸ **registerObjects**(`xObjects`): `void`

Register multiple classes dictionary into the object manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObjects` | [`XObjectPack`](XObjectPack.md) | key value list -> {"view":XView,...} |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:24

___

### removeObject

▸ **removeObject**(`xObjectId`): `void`

Remove XObject from the manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObjectId` | `string` | object id to remove |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObjectManager.d.ts:58
