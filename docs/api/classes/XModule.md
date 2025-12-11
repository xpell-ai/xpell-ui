[xpell-ui - v2.0.0-alpha.1](../README.md) / XModule

# Class: XModule

Xpell Base Module
This class represents xpell base module to be extends
 XModule

## Hierarchy

- **`XModule`**

  ↳ [`XUIModule`](XUIModule.md)

## Indexable

▪ [k: `string`]: `any`

## Table of contents

### Constructors

- [constructor](XModule.md#constructor)

### Properties

- [\_id](XModule.md#_id)
- [\_log\_rules](XModule.md#_log_rules)
- [\_name](XModule.md#_name)

### Accessors

- [\_o](XModule.md#_o)
- [\_object\_manager](XModule.md#_object_manager)
- [om](XModule.md#om)

### Methods

- [\_info](XModule.md#_info)
- [create](XModule.md#create)
- [execute](XModule.md#execute)
- [getObject](XModule.md#getobject)
- [importObject](XModule.md#importobject)
- [importObjectPack](XModule.md#importobjectpack)
- [importObjects](XModule.md#importobjects)
- [load](XModule.md#load)
- [onFrame](XModule.md#onframe)
- [remove](XModule.md#remove)
- [run](XModule.md#run)

## Constructors

### constructor

• **new XModule**(`data`): [`XModule`](XModule.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`XModuleData`](../README.md#xmoduledata) |

#### Returns

[`XModule`](XModule.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:22

## Properties

### \_id

• **\_id**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:16

___

### \_log\_rules

• **\_log\_rules**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `createObject` | `boolean` |
| `removeObject` | `boolean` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:18

___

### \_name

• **\_name**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:17

## Accessors

### \_o

• `get` **_o**(): `XObjectManagerIndex`

Returns the XObject instance from the module Object Manager
Usage:
xmodule._o["object-id"] is equivalent to xmodule.getObject("object-id")

#### Returns

`XObjectManagerIndex`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:78

___

### \_object\_manager

• `get` **_object_manager**(): [`XObjectManager`](XObjectManager.md)

#### Returns

[`XObjectManager`](XObjectManager.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:66

___

### om

• `get` **om**(): [`XObjectManager`](XObjectManager.md)

getter for om (object manager) instance

#### Returns

[`XObjectManager`](XObjectManager.md)

**`Deprecated`**

- use _object_manager instead
If you wish to get an object from the object manager use
getObject directly on the module instead of om.getObject

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:65

## Methods

### \_info

▸ **_info**(`xCommand`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `xCommand` | [`XCommand`](XCommand.md) |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:35

___

### create

▸ **create**(`data`): `any`

Creates new XObject from data object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) | The data of the new object (JSON) |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:29

___

### execute

▸ **execute**(`xCommand`): `Promise`\<`any`\>

execute xpell command - CLI mode

#### Parameters

| Name | Type |
| :------ | :------ |
| `xCommand` | [`XCommand`](XCommand.md) \| [`XCommandData`](../README.md#xcommanddata) |

#### Returns

`Promise`\<`any`\>

command execution result

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:48

___

### getObject

▸ **getObject**(`objectId`): [`XObject`](XObject.md)

Returns the XObject instance from the module Object Manager

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

[`XObject`](XObject.md)

XObject

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:72

___

### importObject

▸ **importObject**(`xObjectName`, `xObject`): `void`

Imports external objects to the engine
The object class should be like XObjects with static implementation of getObjects() method

#### Parameters

| Name | Type |
| :------ | :------ |
| `xObjectName` | `string` |
| `xObject` | [`XObject`](XObject.md) |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:97

___

### importObjectPack

▸ **importObjectPack**(`xObjectPack`): `void`

Imports external object pack to the engine
The object class should be like XObjects with static implementation of getObjects() method

#### Parameters

| Name | Type |
| :------ | :------ |
| `xObjectPack` | `any` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:84

___

### importObjects

▸ **importObjects**(`xObjectPack`): `void`

Imports external object pack to the engine

#### Parameters

| Name | Type |
| :------ | :------ |
| `xObjectPack` | `any` |

#### Returns

`void`

**`Deprecated`**

- use importObjectPack instead

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:90

___

### load

▸ **load**(): `void`

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:23

___

### onFrame

▸ **onFrame**(`frameNumber`): `Promise`\<`void`\>

This method triggers every frame from the Xpell engine.
The method can be override by the extending module to support extended onFrame functionality

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frameNumber` | `number` | Current frame number |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:54

___

### remove

▸ **remove**(`objectId`): `void`

removes and XObject from the object manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `objectId` | `string` | op |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:34

___

### run

▸ **run**(`stringXCommand`): `Promise`\<`any`\>

Run xpell command -
CLI mode, parse the command to XCommand JSON format and call execute method

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringXCommand` | `string` |

#### Returns

`Promise`\<`any`\>

command execution result

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:42
