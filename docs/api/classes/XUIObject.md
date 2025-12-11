[xpell-ui - v2.0.0-alpha.1](../README.md) / XUIObject

# Class: XUIObject

ADD On Event support
 - override addEventListener to add html event listener if object exist
 - override removeEventListener to remove html event listener
 - check for events in getDOMObject and add them to the object

## Hierarchy

- [`XObject`](XObject.md)

  ↳ **`XUIObject`**

  ↳↳ [`XView`](XView.md)

  ↳↳ [`XButton`](XButton.md)

  ↳↳ [`XForm`](XForm.md)

  ↳↳ [`XHeader`](XHeader.md)

  ↳↳ [`XImage`](XImage.md)

  ↳↳ [`XLabel`](XLabel.md)

  ↳↳ [`XLink`](XLink.md)

  ↳↳ [`XList`](XList.md)

  ↳↳ [`XNavBar`](XNavBar.md)

  ↳↳ [`XTextArea`](XTextArea.md)

  ↳↳ [`XTextField`](XTextField.md)

  ↳↳ [`XVideo`](XVideo.md)

  ↳↳ [`XWebcam`](XWebcam.md)

  ↳↳ [`XHTML`](XHTML.md)

  ↳↳ [`XInput`](XInput.md)

  ↳↳ [`XSVG`](XSVG.md)

  ↳↳ [`XPassword`](XPassword.md)

  ↳↳ [`XSVGCircle`](XSVGCircle.md)

  ↳↳ [`XSVGEllipse`](XSVGEllipse.md)

  ↳↳ [`XSVGLine`](XSVGLine.md)

  ↳↳ [`XSVGPolygon`](XSVGPolygon.md)

  ↳↳ [`XSVGRect`](XSVGRect.md)

  ↳↳ [`XSVGPolyline`](XSVGPolyline.md)

  ↳↳ [`XSVGPath`](XSVGPath.md)

## Table of contents

### Constructors

- [constructor](XUIObject.md#constructor)

### Properties

- [\_base\_display](XUIObject.md#_base_display)
- [\_cache\_cmd\_txt](XUIObject.md#_cache_cmd_txt)
- [\_cache\_jcmd](XUIObject.md#_cache_jcmd)
- [\_children](XUIObject.md#_children)
- [\_data\_source](XUIObject.md#_data_source)
- [\_debug](XUIObject.md#_debug)
- [\_dom\_object](XUIObject.md#_dom_object)
- [\_event\_listeners\_ids](XUIObject.md#_event_listeners_ids)
- [\_html](XUIObject.md#_html)
- [\_html\_ns](XUIObject.md#_html_ns)
- [\_html\_tag](XUIObject.md#_html_tag)
- [\_id](XUIObject.md#_id)
- [\_name](XUIObject.md#_name)
- [\_nano\_commands](XUIObject.md#_nano_commands)
- [\_on](XUIObject.md#_on)
- [\_on\_click](XUIObject.md#_on_click)
- [\_on\_create](XUIObject.md#_on_create)
- [\_on\_data](XUIObject.md#_on_data)
- [\_on\_event](XUIObject.md#_on_event)
- [\_on\_frame](XUIObject.md#_on_frame)
- [\_on\_hide](XUIObject.md#_on_hide)
- [\_on\_hide\_animation](XUIObject.md#_on_hide_animation)
- [\_on\_mount](XUIObject.md#_on_mount)
- [\_on\_show](XUIObject.md#_on_show)
- [\_on\_show\_animation](XUIObject.md#_on_show_animation)
- [\_once](XUIObject.md#_once)
- [\_parent](XUIObject.md#_parent)
- [\_parent\_element](XUIObject.md#_parent_element)
- [\_process\_data](XUIObject.md#_process_data)
- [\_process\_frame](XUIObject.md#_process_frame)
- [\_type](XUIObject.md#_type)
- [\_visible](XUIObject.md#_visible)
- [\_xem\_options](XUIObject.md#_xem_options)
- [\_xporter](XUIObject.md#_xporter)

### Accessors

- [\_text](XUIObject.md#_text)
- [dom](XUIObject.md#dom)

### Methods

- [addChild](XUIObject.md#addchild)
- [addClass](XUIObject.md#addclass)
- [addEventListener](XUIObject.md#addeventlistener)
- [addNanoCommand](XUIObject.md#addnanocommand)
- [addNanoCommandPack](XUIObject.md#addnanocommandpack)
- [addXporterDataIgnoreFields](XUIObject.md#addxporterdataignorefields)
- [addXporterInstanceXporter](XUIObject.md#addxporterinstancexporter)
- [animate](XUIObject.md#animate)
- [append](XUIObject.md#append)
- [attach](XUIObject.md#attach)
- [checkAndRunInternalFunction](XUIObject.md#checkandruninternalfunction)
- [clearAttributes](XUIObject.md#clearattributes)
- [click](XUIObject.md#click)
- [dispose](XUIObject.md#dispose)
- [emptyDataSource](XUIObject.md#emptydatasource)
- [execute](XUIObject.md#execute)
- [getDOMObject](XUIObject.md#getdomobject)
- [getHTML](XUIObject.md#gethtml)
- [hide](XUIObject.md#hide)
- [init](XUIObject.md#init)
- [log](XUIObject.md#log)
- [mount](XUIObject.md#mount)
- [onCreate](XUIObject.md#oncreate)
- [onData](XUIObject.md#ondata)
- [onFrame](XUIObject.md#onframe)
- [onHide](XUIObject.md#onhide)
- [onMount](XUIObject.md#onmount)
- [onShow](XUIObject.md#onshow)
- [parse](XUIObject.md#parse)
- [parseEvents](XUIObject.md#parseevents)
- [parseFields](XUIObject.md#parsefields)
- [parseFieldsFromXDataObject](XUIObject.md#parsefieldsfromxdataobject)
- [removeAllEventListeners](XUIObject.md#removealleventlisteners)
- [removeChild](XUIObject.md#removechild)
- [removeClass](XUIObject.md#removeclass)
- [removeEventListener](XUIObject.md#removeeventlistener)
- [replaceClass](XUIObject.md#replaceclass)
- [run](XUIObject.md#run)
- [setStyleAttribute](XUIObject.md#setstyleattribute)
- [setText](XUIObject.md#settext)
- [show](XUIObject.md#show)
- [stopAnimation](XUIObject.md#stopanimation)
- [toString](XUIObject.md#tostring)
- [toXData](XUIObject.md#toxdata)
- [toggle](XUIObject.md#toggle)
- [toggleClass](XUIObject.md#toggleclass)

## Constructors

### constructor

• **new XUIObject**(`data`, `defaults`, `skipParse?`): [`XUIObject`](XUIObject.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) |
| `defaults` | [`XObjectData`](../README.md#xobjectdata) |
| `skipParse?` | `boolean` |

#### Returns

[`XUIObject`](XUIObject.md)

#### Overrides

[XObject](XObject.md).[constructor](XObject.md#constructor)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:70](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L70)

## Properties

### \_base\_display

• `Optional` **\_base\_display**: ``null`` \| `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:55](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L55)

___

### \_cache\_cmd\_txt

• `Protected` `Optional` **\_cache\_cmd\_txt**: `string`

#### Overrides

[XObject](XObject.md).[_cache_cmd_txt](XObject.md#_cache_cmd_txt)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:44](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L44)

___

### \_cache\_jcmd

• `Protected` `Optional` **\_cache\_jcmd**: `any`

#### Overrides

[XObject](XObject.md).[_cache_jcmd](XObject.md#_cache_jcmd)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:45](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L45)

___

### \_children

• **\_children**: ([`XUIObject`](XUIObject.md) \| [`XObjectData`](../README.md#xobjectdata))[]

#### Overrides

[XObject](XObject.md).[_children](XObject.md#_children)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:29](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L29)

___

### \_data\_source

• `Optional` **\_data\_source**: `string`

#### Overrides

[XObject](XObject.md).[_data_source](XObject.md#_data_source)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:32](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L32)

___

### \_debug

• `Optional` **\_debug**: `boolean`

#### Inherited from

[XObject](XObject.md).[_debug](XObject.md#_debug)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:81

___

### \_dom\_object

• `Protected` **\_dom\_object**: `any`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:53](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L53)

___

### \_event\_listeners\_ids

• `Protected` **\_event\_listeners\_ids**: `Object`

#### Index signature

▪ [eventName: `string`]: `string`

#### Overrides

[XObject](XObject.md).[_event_listeners_ids](XObject.md#_event_listeners_ids)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:46](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L46)

___

### \_html

• `Optional` **\_html**: `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:54](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L54)

___

### \_html\_ns

• `Optional` **\_html\_ns**: ``null`` \| `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:52](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L52)

___

### \_html\_tag

• **\_html\_tag**: `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:51](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L51)

___

### \_id

• **\_id**: `string`

#### Overrides

[XObject](XObject.md).[_id](XObject.md#_id)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:27](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L27)

___

### \_name

• `Optional` **\_name**: `string`

#### Overrides

[XObject](XObject.md).[_name](XObject.md#_name)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:31](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L31)

___

### \_nano\_commands

• `Protected` **\_nano\_commands**: `Object`

#### Index signature

▪ [k: `string`]: [`XNanoCommand`](../interfaces/XNanoCommand.md)

#### Overrides

[XObject](XObject.md).[_nano_commands](XObject.md#_nano_commands)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:43](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L43)

___

### \_on

• **\_on**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Overrides

[XObject](XObject.md).[_on](XObject.md#_on)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:33](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L33)

___

### \_on\_click

• `Optional` **\_on\_click**: `string` \| `Function`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:61](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L61)

___

### \_on\_create

• `Optional` **\_on\_create**: `string` \| `Function`

#### Overrides

[XObject](XObject.md).[_on_create](XObject.md#_on_create)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:35](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L35)

___

### \_on\_data

• `Optional` **\_on\_data**: `string` \| `Function`

#### Overrides

[XObject](XObject.md).[_on_data](XObject.md#_on_data)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:38](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L38)

___

### \_on\_event

• `Optional` **\_on\_event**: `string` \| `Function`

#### Overrides

[XObject](XObject.md).[_on_event](XObject.md#_on_event)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:39](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L39)

___

### \_on\_frame

• `Optional` **\_on\_frame**: `string` \| `Function`

#### Overrides

[XObject](XObject.md).[_on_frame](XObject.md#_on_frame)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:37](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L37)

___

### \_on\_hide

• `Optional` **\_on\_hide**: `string` \| `Function`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:63](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L63)

___

### \_on\_hide\_animation

• `Optional` **\_on\_hide\_animation**: `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:65](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L65)

___

### \_on\_mount

• `Optional` **\_on\_mount**: `string` \| `Function`

#### Overrides

[XObject](XObject.md).[_on_mount](XObject.md#_on_mount)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:36](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L36)

___

### \_on\_show

• `Optional` **\_on\_show**: `string` \| `Function`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:62](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L62)

___

### \_on\_show\_animation

• `Optional` **\_on\_show\_animation**: `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:64](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L64)

___

### \_once

• **\_once**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Overrides

[XObject](XObject.md).[_once](XObject.md#_once)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:34](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L34)

___

### \_parent

• **\_parent**: ``null`` \| [`XUIObject`](XUIObject.md)

#### Overrides

[XObject](XObject.md).[_parent](XObject.md#_parent)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:30](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L30)

___

### \_parent\_element

• `Optional` **\_parent\_element**: `string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:60](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L60)

___

### \_process\_data

• **\_process\_data**: `boolean`

#### Overrides

[XObject](XObject.md).[_process_data](XObject.md#_process_data)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:41](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L41)

___

### \_process\_frame

• **\_process\_frame**: `boolean`

#### Overrides

[XObject](XObject.md).[_process_frame](XObject.md#_process_frame)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:40](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L40)

___

### \_type

• **\_type**: `string`

#### Overrides

[XObject](XObject.md).[_type](XObject.md#_type)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:28](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L28)

___

### \_visible

• **\_visible**: `boolean`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:59](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L59)

___

### \_xem\_options

• `Protected` **\_xem\_options**: [`XEventListenerOptions`](../README.md#xeventlisteneroptions)

#### Overrides

[XObject](XObject.md).[_xem_options](XObject.md#_xem_options)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:42](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L42)

___

### \_xporter

• `Protected` **\_xporter**: [`XDataXporter`](../README.md#xdataxporter)

#### Overrides

[XObject](XObject.md).[_xporter](XObject.md#_xporter)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:47](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L47)

## Accessors

### \_text

• `get` **_text**(): `string`

#### Returns

`string`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:178](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L178)

• `set` **_text**(`text`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:171](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L171)

___

### dom

• `get` **dom**(): `HTMLElement`

DOM Getter

#### Returns

`HTMLElement`

the HTML DOM object same as getDOMObject()

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:166](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L166)

## Methods

### addChild

▸ **addChild**(`child`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | [`XObject`](XObject.md) | the child to add |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addChild](XObject.md#addchild)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:261

___

### addClass

▸ **addClass**(`className`): `void`

Adds a css class to the object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the css class name |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:286](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L286)

___

### addEventListener

▸ **addEventListener**(`eventName`, `handler`, `options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |
| `handler` | `string` \| [`XObjectOnEventHandler`](../README.md#xobjectoneventhandler) |
| `options?` | [`XEventListenerOptions`](../README.md#xeventlisteneroptions) |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addEventListener](XObject.md#addeventlistener)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:118

___

### addNanoCommand

▸ **addNanoCommand**(`commandName`, `nanoCommandFunction`): `void`

Add single nano command to the object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `commandName` | `string` | the nano command name |
| `nanoCommandFunction` | [`XNanoCommand`](../interfaces/XNanoCommand.md) |  |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addNanoCommand](XObject.md#addnanocommand)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:131

___

### addNanoCommandPack

▸ **addNanoCommandPack**(`ncPack`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `ncPack` | [`XNanoCommandPack`](../README.md#xnanocommandpack) |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addNanoCommandPack](XObject.md#addnanocommandpack)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:132

___

### addXporterDataIgnoreFields

▸ **addXporterDataIgnoreFields**(`ignoreFields`): `void`

List of fields to ignore when exporting the xobject to XData or string format

#### Parameters

| Name | Type |
| :------ | :------ |
| `ignoreFields` | `string`[] |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addXporterDataIgnoreFields](XObject.md#addxporterdataignorefields)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:137

___

### addXporterInstanceXporter

▸ **addXporterInstanceXporter**(`classOfInstance`, `handler`): `void`

Add XData Xporter instance handler

#### Parameters

| Name | Type |
| :------ | :------ |
| `classOfInstance` | `any` |
| `handler` | [`XDataXporterHandler`](../interfaces/XDataXporterHandler.md) |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[addXporterInstanceXporter](XObject.md#addxporterinstancexporter)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:142

___

### animate

▸ **animate**(`animation`, `infinite?`): `Promise`\<`unknown`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `animation` | `string` | `undefined` |
| `infinite` | `boolean` | `false` |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:384](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L384)

___

### append

▸ **append**(`xObject`): `any`

Append a child object to the XUIObject, if the object is not XUIObject it will be created

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObject` | `any` | the child object to append can be XUIObject or XObjectData |

#### Returns

`any`

#### Overrides

[XObject](XObject.md).[append](XObject.md#append)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:221](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L221)

___

### attach

▸ **attach**(`parentElementId`): `void`

Attach the object to HTML element

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentElementId` | `string` |

#### Returns

`void`

**`Deprecated`**

use "mount" function instead

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:197](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L197)

___

### checkAndRunInternalFunction

▸ **checkAndRunInternalFunction**(`func`, `...params`): `Promise`\<`void`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `func` | `any` |
| `...params` | `any` |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[checkAndRunInternalFunction](XObject.md#checkandruninternalfunction)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:180

___

### clearAttributes

▸ **clearAttributes**(`attributes`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `attributes` | `string`[] |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[clearAttributes](XObject.md#clearattributes)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:247

___

### click

▸ **click**(): `void`

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:419](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L419)

___

### dispose

▸ **dispose**(): `Promise`\<`void`\>

Dispose all object memory (destructor)

#### Returns

`Promise`\<`void`\>

#### Overrides

[XObject](XObject.md).[dispose](XObject.md#dispose)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:92](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L92)

___

### emptyDataSource

▸ **emptyDataSource**(): `void`

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[emptyDataSource](XObject.md#emptydatasource)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:191

___

### execute

▸ **execute**(`xCommand`): `Promise`\<`void`\>

Execute XCommand within the XObject Nano Commands

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xCommand` | [`XCommand`](XCommand.md) \| [`XCommandData`](../README.md#xcommanddata) | XCommand to execute Nano command example: "set-text" : (xCommand,xObject) => { xObject.setText(xCommands.params.text) } |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[execute](XObject.md#execute)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:236

___

### getDOMObject

▸ **getDOMObject**(): `HTMLElement`

Gets the HTML DOM object, if the object is not created yet it will be created

#### Returns

`HTMLElement`

the HTML DOM object

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:114](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L114)

___

### getHTML

▸ **getHTML**(): `string`

Gets the HTML representation of the object

#### Returns

`string`

the HTML representation of the object

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:186](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L186)

___

### hide

▸ **hide**(): `void`

This method is used to hide the object and trigger the onHide event

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:359](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L359)

___

### init

▸ **init**(`data?`, `skipParse?`): `void`

Initialize the XObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data?` | `any` | data to parse (XObjectData) |
| `skipParse?` | `boolean` | skip data parsing |

#### Returns

`void`

**`Deprecated`**

- use parse method instead

#### Inherited from

[XObject](XObject.md).[init](XObject.md#init)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:116

___

### log

▸ **log**(`message?`, `...optionalParams`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[log](XObject.md#log)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:109

___

### mount

▸ **mount**(`parentElementId`): `void`

Mount the object to HTML element

#### Parameters

| Name | Type |
| :------ | :------ |
| `parentElementId` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:207](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L207)

___

### onCreate

▸ **onCreate**(): `Promise`\<`void`\>

this method triggered after the HTML DOM object has been created and added to the parent element
support external _on_create anonymous function in the , example:
_on_create: async (xObject) => {
     // xObject -> The XObject parent of the _on_create function, use instead of this keyword
     // write code that will be executed each frame.
     // make sure to write async anonymous function.
}

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[onCreate](XObject.md#oncreate)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:179

___

### onData

▸ **onData**(`data`): `Promise`\<`void`\>

Triggers when new data is being received from the data source

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | `any` | the data if override this method make sure to call super.onData(data) to run the _on_data attribute |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[onData](XObject.md#ondata)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:197

___

### onFrame

▸ **onFrame**(`frameNumber`): `Promise`\<`void`\>

Triggers from Xpell frame every frame
Support _on_frame atrribute that can be XCommand string or function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frameNumber` | `number` | XObject supports 1. External _on_frame anonymous function in the , example: _on_frame: async (xObject,frameNumber) => { // xObject -> The XObject parent of the _on_frame function, use instead of this keyword // frameNumber = Xpell current frame number // write code that will be executed each frame. // make sure to write async anonymous function. // be wise with the function execution and try to keep it in the 15ms running time to support 60 FPS } 2. String execution of nano commands _on_frame: "nano command text" |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[onFrame](XObject.md#onframe)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:218

___

### onHide

▸ **onHide**(): `Promise`\<`void`\>

this method triggered when the XUIObject is hidden

#### Returns

`Promise`\<`void`\>

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:493](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L493)

___

### onMount

▸ **onMount**(): `Promise`\<`void`\>

this method triggered after the HTML DOM object has been mounted by the super
it implemented in this class to support the following events for XUIObject:
_on_click: (XUIObject,event) => {}

#### Returns

`Promise`\<`void`\>

#### Overrides

[XObject](XObject.md).[onMount](XObject.md#onmount)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:434](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L434)

___

### onShow

▸ **onShow**(): `Promise`\<`void`\>

this method triggered when the XUIObject is shown

#### Returns

`Promise`\<`void`\>

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:474](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L474)

___

### parse

▸ **parse**(`data`, `ignore?`): `void`

Parse data to the XObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) | data to parse |
| `ignore?` | `any` | lis of words to ignore in the parse process |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[parse](XObject.md#parse)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:148

___

### parseEvents

▸ **parseEvents**(`options?`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `options?` | [`XEventListenerOptions`](../README.md#xeventlisteneroptions) |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[parseEvents](XObject.md#parseevents)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:117

___

### parseFields

▸ **parseFields**(`data`, `fields`, `checkNonXParams?`): `void`

Parse list of fields from IXObjectData to the class

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) | the data |
| `fields` | `string`[] | array of field names (string) |
| `checkNonXParams?` | `boolean` | also check non Xpell fields (fields that not starting with "_" sign) |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[parseFields](XObject.md#parsefields)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:168

___

### parseFieldsFromXDataObject

▸ **parseFieldsFromXDataObject**(`data`, `fields`): `void`

Parse data to the XObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) | data to parse |
| `fields` | `Object` | - |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[parseFieldsFromXDataObject](XObject.md#parsefieldsfromxdataobject)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:159

___

### removeAllEventListeners

▸ **removeAllEventListeners**(): `void`

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[removeAllEventListeners](XObject.md#removealleventlisteners)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:120

___

### removeChild

▸ **removeChild**(`xObject`): `void`

Removes a child object from the XUIObject

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `xObject` | [`XUIObject`](XUIObject.md) | the child object to remove |

#### Returns

`void`

#### Overrides

[XObject](XObject.md).[removeChild](XObject.md#removechild)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:247](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L247)

___

### removeClass

▸ **removeClass**(`className`): `void`

Removes a css class from the object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the css class name |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:296](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L296)

___

### removeEventListener

▸ **removeEventListener**(`eventName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`void`

#### Inherited from

[XObject](XObject.md).[removeEventListener](XObject.md#removeeventlistener)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:119

___

### replaceClass

▸ **replaceClass**(`oldClass`, `newClass`): `void`

Replaces a css class on the object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `oldClass` | `string` | class to be replaced |
| `newClass` | `string` | new class to replace the old class |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:318](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L318)

___

### run

▸ **run**(`nanoCommand`, `cache?`): `Promise`\<`void`\>

Runs object nano commands

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nanoCommand` | `string` | object nano command (string) |
| `cache?` | `boolean` | cache last command to prevent multiple parsing on the same command |

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XObject](XObject.md).[run](XObject.md#run)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:224

___

### setStyleAttribute

▸ **setStyleAttribute**(`attr`, `val`): `void`

Sets the object CSS style

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `attr` | `string` | the CSS attribute |
| `val` | `string` | the CSS value |

#### Returns

`void`

**`Example`**

```ts
xuiObj.setStyle("background-color","red")
```

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:276](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L276)

___

### setText

▸ **setText**(`text`): `void`

Sets the object text content

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `text` | `string` | the text content |

#### Returns

`void`

**`Deprecated`**

use _text property instead (e.g. xuiObj._text = "Xpell rulz!")

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:265](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L265)

___

### show

▸ **show**(): `void`

This method is used to show the object and trigger the onShow event

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:341](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L341)

___

### stopAnimation

▸ **stopAnimation**(): `void`

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:402](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L402)

___

### toString

▸ **toString**(): `string`

Return a string representation of the XObject

#### Returns

`string`

string

#### Inherited from

[XObject](XObject.md).[toString](XObject.md#tostring)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:246

___

### toXData

▸ **toXData**(): [`IXData`](../interfaces/IXData.md)

Return an IXObjectData JSON representation of the XObject

#### Returns

[`IXData`](../interfaces/IXData.md)

IXObjectData

#### Inherited from

[XObject](XObject.md).[toXData](XObject.md#toxdata)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:241

___

### toggle

▸ **toggle**(): `void`

This method is used to toggle the object visibility

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:413](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L413)

___

### toggleClass

▸ **toggleClass**(`className`): `void`

Toggles a css class on the object

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `className` | `string` | the css class name |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:306](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L306)
