xpell-ui

# xpell-ui - v2.0.0-alpha.1

## Table of contents

### References

- [\_wh](README.md#_wh)
- [\_x](README.md#_x)
- [\_xd](README.md#_xd)
- [\_xdb](README.md#_xdb)
- [\_xem](README.md#_xem)
- [\_xlog](README.md#_xlog)
- [\_xu](README.md#_xu)
- [default](README.md#default)

### Enumerations

- [MessageType](enums/MessageType.md)

### Classes

- [XButton](classes/XButton.md)
- [XCommand](classes/XCommand.md)
- [XForm](classes/XForm.md)
- [XHTML](classes/XHTML.md)
- [XHeader](classes/XHeader.md)
- [XImage](classes/XImage.md)
- [XInput](classes/XInput.md)
- [XLabel](classes/XLabel.md)
- [XLink](classes/XLink.md)
- [XList](classes/XList.md)
- [XModule](classes/XModule.md)
- [XNavBar](classes/XNavBar.md)
- [XObject](classes/XObject.md)
- [XObjectManager](classes/XObjectManager.md)
- [XObjectPack](classes/XObjectPack.md)
- [XParser](classes/XParser.md)
- [XPassword](classes/XPassword.md)
- [XSVG](classes/XSVG.md)
- [XSVGCircle](classes/XSVGCircle.md)
- [XSVGEllipse](classes/XSVGEllipse.md)
- [XSVGLine](classes/XSVGLine.md)
- [XSVGPath](classes/XSVGPath.md)
- [XSVGPolygon](classes/XSVGPolygon.md)
- [XSVGPolyline](classes/XSVGPolyline.md)
- [XSVGRect](classes/XSVGRect.md)
- [XTextArea](classes/XTextArea.md)
- [XTextField](classes/XTextField.md)
- [XUIModule](classes/XUIModule.md)
- [XUIObject](classes/XUIObject.md)
- [XUIObjects](classes/XUIObjects.md)
- [XUtils](classes/XUtils.md)
- [XVideo](classes/XVideo.md)
- [XView](classes/XView.md)
- [XViewManager](classes/XViewManager.md)
- [XWebcam](classes/XWebcam.md)
- [XpellEngine](classes/XpellEngine.md)
- [\_AnimateCSS](classes/AnimateCSS.md)
- [\_XData](classes/XData.md)
- [\_XDataBase](classes/XDataBase.md)
- [\_XEventManager](classes/XEventManager.md)
- [\_XLogger](classes/XLogger.md)

### Interfaces

- [IXData](interfaces/IXData.md)
- [IXObjectData](interfaces/IXObjectData.md)
- [XDataXporterHandler](interfaces/XDataXporterHandler.md)
- [XEventListener](interfaces/XEventListener.md)
- [XNanoCommand](interfaces/XNanoCommand.md)
- [XObjectOnEventIndex](interfaces/XObjectOnEventIndex.md)

### Type Aliases

- [HTMLEventListenersIndex](README.md#htmleventlistenersindex)
- [XCommandData](README.md#xcommanddata)
- [XDataObject](README.md#xdataobject)
- [XDataVariable](README.md#xdatavariable)
- [XDataXporter](README.md#xdataxporter)
- [XEvent](README.md#xevent)
- [XEventListenerOptions](README.md#xeventlisteneroptions)
- [XModuleData](README.md#xmoduledata)
- [XNanoCommandPack](README.md#xnanocommandpack)
- [XObjectData](README.md#xobjectdata)
- [XObjectOnEventHandler](README.md#xobjectoneventhandler)
- [XUIApp](README.md#xuiapp)
- [XViewsPack](README.md#xviewspack)

### Variables

- [WormholeEvents](README.md#wormholeevents)
- [Wormholes](README.md#wormholes)
- [XDB](README.md#xdb)
- [XData](README.md#xdata)
- [XEventManager](README.md#xeventmanager)
- [XLogger](README.md#xlogger)
- [XUI](README.md#xui)
- [XUIAnimate](README.md#xuianimate)
- [XVM](README.md#xvm)
- [XVMEvents](README.md#xvmevents)
- [Xpell](README.md#xpell)
- [\_xvm](README.md#_xvm)

## References

### \_wh

Renames and re-exports [Wormholes](README.md#wormholes)

___

### \_x

Renames and re-exports [Xpell](README.md#xpell)

___

### \_xd

Renames and re-exports [XData](README.md#xdata)

___

### \_xdb

Renames and re-exports [XDB](README.md#xdb)

___

### \_xem

Renames and re-exports [XEventManager](README.md#xeventmanager)

___

### \_xlog

Renames and re-exports [XLogger](README.md#xlogger)

___

### \_xu

Renames and re-exports [XUtils](classes/XUtils.md)

___

### default

Renames and re-exports [Xpell](README.md#xpell)

## Type Aliases

### HTMLEventListenersIndex

Ƭ **HTMLEventListenersIndex**: `Object`

#### Index signature

▪ [id: `string`]: \{ `_event_name`: `string` ; `_listener`: `Function` ; `_object?`: `any`  }

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:6

___

### XCommandData

Ƭ **XCommandData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_module` | `string` |
| `_object?` | `string` |
| `_op` | `string` |
| `_params?` | \{ `[k: string]`: `string` \| `number` \| `Function`;  } |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:1

___

### XDataObject

Ƭ **XDataObject**: `Object`

XData (Xpell Global shared Variables & Objects)
This object uses as a real-time shared memory between all Xpell modules nad components
Usage:
 - store primitive variable:
     XData._v["my-var-id"] = "my-var-value"
 - get primitive variable:
     const v = XData._v["my-var-id"]
 - store object:
     XData._o["my-object-id"] = {my:"object"}
 - get object:
     const o = XData._o["my-object-id"]

#### Index signature

▪ [_id: `string`]: `any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:14

___

### XDataVariable

Ƭ **XDataVariable**: `Object`

#### Index signature

▪ [_id: `string`]: `string` \| `number` \| `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:17

___

### XDataXporter

Ƭ **XDataXporter**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_ignore_fields` | `string`[] |
| `_instance_xporters` | \{ `[id: string]`: `XDataInstanceXporter`;  } |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:41

___

### XEvent

Ƭ **XEvent**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_data` | `any` |
| `_id` | `number` |
| `_name` | `string` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:1

___

### XEventListenerOptions

Ƭ **XEventListenerOptions**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_once?` | `boolean` |
| `_support_html?` | `boolean` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:13

___

### XModuleData

Ƭ **XModuleData**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_name` | `string` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XModule.d.ts:4

___

### XNanoCommandPack

Ƭ **XNanoCommandPack**: `Object`

x-nano-command pack

#### Index signature

▪ [k: `string`]: [`XNanoCommand`](interfaces/XNanoCommand.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XNanoCommands.d.ts:15

___

### XObjectData

Ƭ **XObjectData**: `Object`

#### Index signature

▪ [k: `string`]: `string` \| ``null`` \| [] \| `undefined` \| `Function` \| `boolean` \| `number` \| {}

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_children?` | ([`XObject`](classes/XObject.md) \| [`XObjectData`](README.md#xobjectdata))[] |
| `_data_source?` | `string` |
| `_debug?` | `boolean` |
| `_id?` | `string` |
| `_name?` | `string` |
| `_nano_commands?` | [`XNanoCommandPack`](README.md#xnanocommandpack) |
| `_on?` | [`XObjectOnEventIndex`](interfaces/XObjectOnEventIndex.md) |
| `_on_create?` | `string` \| `Function` |
| `_on_data?` | `string` \| `Function` |
| `_on_frame?` | `string` \| `Function` |
| `_on_mount?` | `string` \| `Function` |
| `_once?` | [`XObjectOnEventIndex`](interfaces/XObjectOnEventIndex.md) |
| `_process_data?` | `boolean` |
| `_process_frame?` | `boolean` |
| `_type?` | `string` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:51

___

### XObjectOnEventHandler

Ƭ **XObjectOnEventHandler**: (`xObject`: [`XObject`](classes/XObject.md), `data?`: `any`) => `void`

#### Type declaration

▸ (`xObject`, `data?`): `void`

##### Parameters

| Name | Type |
| :------ | :------ |
| `xObject` | [`XObject`](classes/XObject.md) |
| `data?` | `any` |

##### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:47

___

### XUIApp

Ƭ **XUIApp**: `Object`

XUIApp is the Xpell UI Application object, it can hold views and controls

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_controls?` | \{ `[k: string]`: {} \| `string`; `_parent_element`: `string` \| {}  } |
| `_controls._parent_element` | `string` \| {} |
| `_views?` | [`XViewsPack`](README.md#xviewspack) |
| `xpell?` | \{ `version?`: `number`  } |
| `xpell.version?` | `number` |

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:27](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L27)

___

### XViewsPack

Ƭ **XViewsPack**: `Object`

#### Index signature

▪ [k: `string`]: {} \| `string`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_parent_element` | `string` \| {} |

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:15](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L15)

## Variables

### WormholeEvents

• `Const` **WormholeEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `ResponseDataArrived` | `string` |
| `WormholeClose` | `string` |
| `WormholeOpen` | `string` |

#### Defined in

[web/xpell-ui/src/Wormholes/Wormholes.ts:24](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/Wormholes/Wormholes.ts#L24)

___

### Wormholes

• `Const` **Wormholes**: `WormholeInstance`

#### Defined in

[web/xpell-ui/src/Wormholes/Wormholes.ts:305](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/Wormholes/Wormholes.ts#L305)

___

### XDB

• `Const` **XDB**: [`_XDataBase`](classes/XDataBase.md)

#### Defined in

[web/xpell-ui/src/XDB/XDB.ts:133](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XDB/XDB.ts#L133)

___

### XData

• `Const` **XData**: [`_XData`](classes/XData.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XData.d.ts:68

___

### XEventManager

• `Const` **XEventManager**: [`_XEventManager`](classes/XEventManager.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:95

___

### XLogger

• `Const` **XLogger**: [`_XLogger`](classes/XLogger.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:44

___

### XUI

• `Const` **XUI**: [`XUIModule`](classes/XUIModule.md)

#### Defined in

[web/xpell-ui/src/XUI/XUI.ts:350](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUI.ts#L350)

___

### XUIAnimate

• `Const` **XUIAnimate**: [`_AnimateCSS`](classes/AnimateCSS.md)

#### Defined in

[web/xpell-ui/src/XUI/XUIAnimations.ts:119](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIAnimations.ts#L119)

___

### XVM

• `Const` **XVM**: `_XVM`

#### Defined in

[web/xpell-ui/src/XUI/XVM.ts:543](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XVM.ts#L543)

___

### XVMEvents

• `Const` **XVMEvents**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_container_added` | ``"container-added"`` |

#### Defined in

[web/xpell-ui/src/XUI/XVM.ts:37](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XVM.ts#L37)

___

### Xpell

• `Const` **Xpell**: [`XpellEngine`](classes/XpellEngine.md)

Xpell Engine instance
 Xpell Engine instance

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:93

___

### \_xvm

• `Const` **\_xvm**: `_XVM` = `XVM`

#### Defined in

[web/xpell-ui/src/XUI/XVM.ts:544](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XVM.ts#L544)
