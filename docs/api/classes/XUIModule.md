[xpell-ui - v2.0.0-alpha.1](../README.md) / XUIModule

# Class: XUIModule

XUI Module - Xpell User Interface Module for HTML and CSS

## Hierarchy

- [`XModule`](XModule.md)

  ↳ **`XUIModule`**

## Table of contents

### Constructors

- [constructor](XUIModule.md#constructor)

### Properties

- [\_events](XUIModule.md#_events)
- [\_first\_gesture\_occurred](XUIModule.md#_first_gesture_occurred)
- [\_id](XUIModule.md#_id)
- [\_log\_rules](XUIModule.md#_log_rules)
- [\_name](XUIModule.md#_name)
- [vm](XUIModule.md#vm)

### Accessors

- [\_o](XUIModule.md#_o)
- [\_object\_manager](XUIModule.md#_object_manager)
- [om](XUIModule.md#om)

### Methods

- [\_info](XUIModule.md#_info)
- [add](XUIModule.md#add)
- [addControlsPack](XUIModule.md#addcontrolspack)
- [append](XUIModule.md#append)
- [create](XUIModule.md#create)
- [createFromTemplate](XUIModule.md#createfromtemplate)
- [createPlayer](XUIModule.md#createplayer)
- [enableFirstUserGestureEvent](XUIModule.md#enablefirstusergestureevent)
- [execute](XUIModule.md#execute)
- [getObject](XUIModule.md#getobject)
- [hide](XUIModule.md#hide)
- [importObject](XUIModule.md#importobject)
- [importObjectPack](XUIModule.md#importobjectpack)
- [importObjects](XUIModule.md#importobjects)
- [load](XUIModule.md#load)
- [loadApp](XUIModule.md#loadapp)
- [loadControl](XUIModule.md#loadcontrol)
- [loadObject](XUIModule.md#loadobject)
- [onFrame](XUIModule.md#onframe)
- [openUrl](XUIModule.md#openurl)
- [remove](XUIModule.md#remove)
- [run](XUIModule.md#run)
- [show](XUIModule.md#show)
- [toggle](XUIModule.md#toggle)
- [wrap](XUIModule.md#wrap)

## Constructors

### constructor

• **new XUIModule**(`data`): [`XUIModule`](XUIModule.md)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XModuleData`](../README.md#xmoduledata) | module data |

#### Returns

[`XUIModule`](XUIModule.md)

**`Fires`**

"xui-loaded" event

#### Overrides

[XModule](XModule.md).[constructor](XModule.md#constructor)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:62](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L62)

## Properties

### \_events

• **\_events**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_loaded` | `string` |

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:51](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L51)

___

### \_first\_gesture\_occurred

• **\_first\_gesture\_occurred**: `boolean`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:49](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L49)

___

### \_id

• **\_id**: `string`

#### Inherited from

[XModule](XModule.md).[_id](XModule.md#_id)

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

#### Inherited from

[XModule](XModule.md).[_log_rules](XModule.md#_log_rules)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:18

___

### \_name

• **\_name**: `string`

#### Inherited from

[XModule](XModule.md).[_name](XModule.md#_name)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:17

___

### vm

• **vm**: [`XViewManager`](XViewManager.md)

**`Deprecated`**

Use XVM / _xvm instead for new code.

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:47](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L47)

## Accessors

### \_o

• `get` **_o**(): `XObjectManagerIndex`

Returns the XObject instance from the module Object Manager
Usage:
xmodule._o["object-id"] is equivalent to xmodule.getObject("object-id")

#### Returns

`XObjectManagerIndex`

#### Inherited from

XModule.\_o

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:78

___

### \_object\_manager

• `get` **_object_manager**(): [`XObjectManager`](XObjectManager.md)

#### Returns

[`XObjectManager`](XObjectManager.md)

#### Inherited from

XModule.\_object\_manager

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

#### Inherited from

XModule.om

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

#### Inherited from

[XModule](XModule.md).[_info](XModule.md#_info)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:35

___

### add

▸ **add**(`xData`): [`XUIObject`](XUIObject.md)

Create a XUIObject and mount it to the DOM parent element.
If xData._parent_element is not provided the object will be appended
to the player element or to the document body if player element is not provided.

#### Parameters

| Name | Type |
| :------ | :------ |
| `xData` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

[`XUIObject`](XUIObject.md)

XUIObject

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:84](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L84)

___

### addControlsPack

▸ **addControlsPack**(`controls`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `controls` | `Object` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:206](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L206)

___

### append

▸ **append**(`xobj`, `parentXobjId`): `any`

Append XUIObject to the parent XUI Object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xobj` | [`XUIObject`](XUIObject.md) \| [`XObjectData`](../README.md#xobjectdata) | XUIObject or raw XObjectData to append |
| `parentXobjId` | `string` | the parent XUIObject id |

#### Returns

`any`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:120](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L120)

___

### create

▸ **create**(`data?`): [`XUIObject`](XUIObject.md)

Create a XUIObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | [`XObjectData`](../README.md#xobjectdata) | XObjectData representing the XUIObject |

#### Returns

[`XUIObject`](XUIObject.md)

XUIObject

#### Overrides

[XModule](XModule.md).[create](XModule.md#create)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:138](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L138)

___

### createFromTemplate

▸ **createFromTemplate**(`xpell2json`): [`XUIObject`](XUIObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `xpell2json` | `Object` |

#### Returns

[`XUIObject`](XUIObject.md)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:260](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L260)

___

### createPlayer

▸ **createPlayer**(`playerId?`, `cssClass?`, `parentElementId?`, `setAsMainPlayer?`): `HTMLDivElement`

This method creates a player element and appends it to the DOM

#### Parameters

| Name | Type |
| :------ | :------ |
| `playerId?` | `string` |
| `cssClass?` | `string` |
| `parentElementId?` | `string` |
| `setAsMainPlayer?` | `boolean` |

#### Returns

`HTMLDivElement`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:290](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L290)

___

### enableFirstUserGestureEvent

▸ **enableFirstUserGestureEvent**(): `void`

The method fires "first-user-gesture" event 
This method is for all Web API that requires User Gesture event.

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:268](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L268)

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

#### Inherited from

[XModule](XModule.md).[execute](XModule.md#execute)

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

#### Inherited from

[XModule](XModule.md).[getObject](XModule.md#getobject)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:72

___

### hide

▸ **hide**(`objectId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:335](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L335)

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

#### Inherited from

[XModule](XModule.md).[importObject](XModule.md#importobject)

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

#### Inherited from

[XModule](XModule.md).[importObjectPack](XModule.md#importobjectpack)

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

#### Inherited from

[XModule](XModule.md).[importObjects](XModule.md#importobjects)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:90

___

### load

▸ **load**(): `void`

#### Returns

`void`

#### Inherited from

[XModule](XModule.md).[load](XModule.md#load)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:23

___

### loadApp

▸ **loadApp**(`xuiApp`): `void`

Loads Xpell application object

#### Parameters

| Name | Type |
| :------ | :------ |
| `xuiApp` | [`XUIApp`](../README.md#xuiapp) |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:172](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L172)

___

### loadControl

▸ **loadControl**(`data`): [`XUIObject`](XUIObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

[`XUIObject`](XUIObject.md)

**`Deprecated`**

use XUI.add instead

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:219](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L219)

___

### loadObject

▸ **loadObject**(`data`): [`XUIObject`](XUIObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

[`XUIObject`](XUIObject.md)

**`Deprecated`**

use XUI.add instead

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:237](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L237)

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

#### Inherited from

[XModule](XModule.md).[onFrame](XModule.md#onframe)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:54

___

### openUrl

▸ **openUrl**(`url`, `newWindow?`): `void`

Navigate the browser to new url

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |
| `newWindow?` | `boolean` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:186](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L186)

___

### remove

▸ **remove**(`objectId`): `void`

Removes the XUIObject from the DOM by ID and from the Object Manager

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`void`

#### Overrides

[XModule](XModule.md).[remove](XModule.md#remove)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:198](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L198)

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

#### Inherited from

[XModule](XModule.md).[run](XModule.md#run)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:42

___

### show

▸ **show**(`objectId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:328](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L328)

___

### toggle

▸ **toggle**(`objectId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `objectId` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:342](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L342)

___

### wrap

▸ **wrap**(`xObjects`, `wrapper?`): [`XObjectData`](../README.md#xobjectdata)

Wraps an array of XObjectData objects with a wrapper object and returns the wrapper 
with the wrapped objects as children

#### Parameters

| Name | Type |
| :------ | :------ |
| `xObjects` | [`XObjectData`](../README.md#xobjectdata)[] |
| `wrapper?` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

[`XObjectData`](../README.md#xobjectdata)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:152](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L152)
