[xpell-ui - v2.0.0-alpha.1](../README.md) / XVideo

# Class: XVideo

ADD On Event support
 - override addEventListener to add html event listener if object exist
 - override removeEventListener to remove html event listener
 - check for events in getDOMObject and add them to the object

## Hierarchy

- [`XUIObject`](XUIObject.md)

  ↳ **`XVideo`**

## Table of contents

### Constructors

- [constructor](XVideo.md#constructor)

### Properties

- [\_base\_display](XVideo.md#_base_display)
- [\_cache\_cmd\_txt](XVideo.md#_cache_cmd_txt)
- [\_cache\_jcmd](XVideo.md#_cache_jcmd)
- [\_children](XVideo.md#_children)
- [\_data\_source](XVideo.md#_data_source)
- [\_debug](XVideo.md#_debug)
- [\_dom\_object](XVideo.md#_dom_object)
- [\_event\_listeners\_ids](XVideo.md#_event_listeners_ids)
- [\_html](XVideo.md#_html)
- [\_html\_ns](XVideo.md#_html_ns)
- [\_html\_tag](XVideo.md#_html_tag)
- [\_id](XVideo.md#_id)
- [\_name](XVideo.md#_name)
- [\_nano\_commands](XVideo.md#_nano_commands)
- [\_on](XVideo.md#_on)
- [\_on\_click](XVideo.md#_on_click)
- [\_on\_create](XVideo.md#_on_create)
- [\_on\_data](XVideo.md#_on_data)
- [\_on\_event](XVideo.md#_on_event)
- [\_on\_frame](XVideo.md#_on_frame)
- [\_on\_hide](XVideo.md#_on_hide)
- [\_on\_hide\_animation](XVideo.md#_on_hide_animation)
- [\_on\_mount](XVideo.md#_on_mount)
- [\_on\_show](XVideo.md#_on_show)
- [\_on\_show\_animation](XVideo.md#_on_show_animation)
- [\_once](XVideo.md#_once)
- [\_parent](XVideo.md#_parent)
- [\_parent\_element](XVideo.md#_parent_element)
- [\_process\_data](XVideo.md#_process_data)
- [\_process\_frame](XVideo.md#_process_frame)
- [\_type](XVideo.md#_type)
- [\_visible](XVideo.md#_visible)
- [\_xem\_options](XVideo.md#_xem_options)
- [\_xporter](XVideo.md#_xporter)
- [\_xtype](XVideo.md#_xtype)

### Accessors

- [\_text](XVideo.md#_text)
- [dom](XVideo.md#dom)

### Methods

- [addChild](XVideo.md#addchild)
- [addClass](XVideo.md#addclass)
- [addEventListener](XVideo.md#addeventlistener)
- [addNanoCommand](XVideo.md#addnanocommand)
- [addNanoCommandPack](XVideo.md#addnanocommandpack)
- [addXporterDataIgnoreFields](XVideo.md#addxporterdataignorefields)
- [addXporterInstanceXporter](XVideo.md#addxporterinstancexporter)
- [animate](XVideo.md#animate)
- [append](XVideo.md#append)
- [attach](XVideo.md#attach)
- [checkAndRunInternalFunction](XVideo.md#checkandruninternalfunction)
- [clearAttributes](XVideo.md#clearattributes)
- [click](XVideo.md#click)
- [dispose](XVideo.md#dispose)
- [emptyDataSource](XVideo.md#emptydatasource)
- [execute](XVideo.md#execute)
- [getDOMObject](XVideo.md#getdomobject)
- [getHTML](XVideo.md#gethtml)
- [hide](XVideo.md#hide)
- [init](XVideo.md#init)
- [log](XVideo.md#log)
- [mount](XVideo.md#mount)
- [onCreate](XVideo.md#oncreate)
- [onData](XVideo.md#ondata)
- [onFrame](XVideo.md#onframe)
- [onHide](XVideo.md#onhide)
- [onMount](XVideo.md#onmount)
- [onShow](XVideo.md#onshow)
- [parse](XVideo.md#parse)
- [parseEvents](XVideo.md#parseevents)
- [parseFields](XVideo.md#parsefields)
- [parseFieldsFromXDataObject](XVideo.md#parsefieldsfromxdataobject)
- [removeAllEventListeners](XVideo.md#removealleventlisteners)
- [removeChild](XVideo.md#removechild)
- [removeClass](XVideo.md#removeclass)
- [removeEventListener](XVideo.md#removeeventlistener)
- [replaceClass](XVideo.md#replaceclass)
- [run](XVideo.md#run)
- [setStyleAttribute](XVideo.md#setstyleattribute)
- [setText](XVideo.md#settext)
- [show](XVideo.md#show)
- [stopAnimation](XVideo.md#stopanimation)
- [toString](XVideo.md#tostring)
- [toXData](XVideo.md#toxdata)
- [toggle](XVideo.md#toggle)
- [toggleClass](XVideo.md#toggleclass)

## Constructors

### constructor

• **new XVideo**(`data`): [`XVideo`](XVideo.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

[`XVideo`](XVideo.md)

#### Overrides

[XUIObject](XUIObject.md).[constructor](XUIObject.md#constructor)

#### Defined in

[web/xpell-ui/src/XUI/XUICoreObjects.ts:87](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUICoreObjects.ts#L87)

## Properties

### \_base\_display

• `Optional` **\_base\_display**: ``null`` \| `string`

#### Inherited from

[XUIObject](XUIObject.md).[_base_display](XUIObject.md#_base_display)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:55](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L55)

___

### \_cache\_cmd\_txt

• `Protected` `Optional` **\_cache\_cmd\_txt**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_cache_cmd_txt](XUIObject.md#_cache_cmd_txt)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:44](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L44)

___

### \_cache\_jcmd

• `Protected` `Optional` **\_cache\_jcmd**: `any`

#### Inherited from

[XUIObject](XUIObject.md).[_cache_jcmd](XUIObject.md#_cache_jcmd)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:45](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L45)

___

### \_children

• **\_children**: ([`XUIObject`](XUIObject.md) \| [`XObjectData`](../README.md#xobjectdata))[]

#### Inherited from

[XUIObject](XUIObject.md).[_children](XUIObject.md#_children)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:29](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L29)

___

### \_data\_source

• `Optional` **\_data\_source**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_data_source](XUIObject.md#_data_source)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:32](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L32)

___

### \_debug

• `Optional` **\_debug**: `boolean`

#### Inherited from

[XUIObject](XUIObject.md).[_debug](XUIObject.md#_debug)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:81

___

### \_dom\_object

• `Protected` **\_dom\_object**: `any`

#### Inherited from

[XUIObject](XUIObject.md).[_dom_object](XUIObject.md#_dom_object)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:53](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L53)

___

### \_event\_listeners\_ids

• `Protected` **\_event\_listeners\_ids**: `Object`

#### Index signature

▪ [eventName: `string`]: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_event_listeners_ids](XUIObject.md#_event_listeners_ids)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:46](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L46)

___

### \_html

• `Optional` **\_html**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_html](XUIObject.md#_html)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:54](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L54)

___

### \_html\_ns

• `Optional` **\_html\_ns**: ``null`` \| `string`

#### Inherited from

[XUIObject](XUIObject.md).[_html_ns](XUIObject.md#_html_ns)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:52](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L52)

___

### \_html\_tag

• **\_html\_tag**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_html_tag](XUIObject.md#_html_tag)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:51](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L51)

___

### \_id

• **\_id**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_id](XUIObject.md#_id)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:27](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L27)

___

### \_name

• `Optional` **\_name**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_name](XUIObject.md#_name)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:31](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L31)

___

### \_nano\_commands

• `Protected` **\_nano\_commands**: `Object`

#### Index signature

▪ [k: `string`]: [`XNanoCommand`](../interfaces/XNanoCommand.md)

#### Inherited from

[XUIObject](XUIObject.md).[_nano_commands](XUIObject.md#_nano_commands)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:43](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L43)

___

### \_on

• **\_on**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Inherited from

[XUIObject](XUIObject.md).[_on](XUIObject.md#_on)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:33](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L33)

___

### \_on\_click

• `Optional` **\_on\_click**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_click](XUIObject.md#_on_click)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:61](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L61)

___

### \_on\_create

• `Optional` **\_on\_create**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_create](XUIObject.md#_on_create)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:35](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L35)

___

### \_on\_data

• `Optional` **\_on\_data**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_data](XUIObject.md#_on_data)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:38](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L38)

___

### \_on\_event

• `Optional` **\_on\_event**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_event](XUIObject.md#_on_event)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:39](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L39)

___

### \_on\_frame

• `Optional` **\_on\_frame**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_frame](XUIObject.md#_on_frame)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:37](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L37)

___

### \_on\_hide

• `Optional` **\_on\_hide**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_hide](XUIObject.md#_on_hide)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:63](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L63)

___

### \_on\_hide\_animation

• `Optional` **\_on\_hide\_animation**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_on_hide_animation](XUIObject.md#_on_hide_animation)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:65](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L65)

___

### \_on\_mount

• `Optional` **\_on\_mount**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_mount](XUIObject.md#_on_mount)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:36](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L36)

___

### \_on\_show

• `Optional` **\_on\_show**: `string` \| `Function`

#### Inherited from

[XUIObject](XUIObject.md).[_on_show](XUIObject.md#_on_show)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:62](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L62)

___

### \_on\_show\_animation

• `Optional` **\_on\_show\_animation**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_on_show_animation](XUIObject.md#_on_show_animation)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:64](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L64)

___

### \_once

• **\_once**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Inherited from

[XUIObject](XUIObject.md).[_once](XUIObject.md#_once)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:34](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L34)

___

### \_parent

• **\_parent**: ``null`` \| [`XUIObject`](XUIObject.md)

#### Inherited from

[XUIObject](XUIObject.md).[_parent](XUIObject.md#_parent)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:30](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L30)

___

### \_parent\_element

• `Optional` **\_parent\_element**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_parent_element](XUIObject.md#_parent_element)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:60](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L60)

___

### \_process\_data

• **\_process\_data**: `boolean`

#### Inherited from

[XUIObject](XUIObject.md).[_process_data](XUIObject.md#_process_data)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:41](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L41)

___

### \_process\_frame

• **\_process\_frame**: `boolean`

#### Inherited from

[XUIObject](XUIObject.md).[_process_frame](XUIObject.md#_process_frame)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:40](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L40)

___

### \_type

• **\_type**: `string`

#### Inherited from

[XUIObject](XUIObject.md).[_type](XUIObject.md#_type)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:28](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L28)

___

### \_visible

• **\_visible**: `boolean`

#### Inherited from

[XUIObject](XUIObject.md).[_visible](XUIObject.md#_visible)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:59](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L59)

___

### \_xem\_options

• `Protected` **\_xem\_options**: [`XEventListenerOptions`](../README.md#xeventlisteneroptions)

#### Inherited from

[XUIObject](XUIObject.md).[_xem_options](XUIObject.md#_xem_options)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:42](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L42)

___

### \_xporter

• `Protected` **\_xporter**: [`XDataXporter`](../README.md#xdataxporter)

#### Inherited from

[XUIObject](XUIObject.md).[_xporter](XUIObject.md#_xporter)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:47](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L47)

___

### \_xtype

▪ `Static` **\_xtype**: `string` = `"video"`

#### Defined in

[web/xpell-ui/src/XUI/XUICoreObjects.ts:86](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUICoreObjects.ts#L86)

## Accessors

### \_text

• `get` **_text**(): `string`

#### Returns

`string`

#### Inherited from

XUIObject.\_text

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:178](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L178)

• `set` **_text**(`text`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `text` | `string` |

#### Returns

`void`

#### Inherited from

XUIObject.\_text

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:171](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L171)

___

### dom

• `get` **dom**(): `HTMLElement`

DOM Getter

#### Returns

`HTMLElement`

the HTML DOM object same as getDOMObject()

#### Inherited from

XUIObject.dom

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

[XUIObject](XUIObject.md).[addChild](XUIObject.md#addchild)

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

#### Inherited from

[XUIObject](XUIObject.md).[addClass](XUIObject.md#addclass)

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

[XUIObject](XUIObject.md).[addEventListener](XUIObject.md#addeventlistener)

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

[XUIObject](XUIObject.md).[addNanoCommand](XUIObject.md#addnanocommand)

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

[XUIObject](XUIObject.md).[addNanoCommandPack](XUIObject.md#addnanocommandpack)

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

[XUIObject](XUIObject.md).[addXporterDataIgnoreFields](XUIObject.md#addxporterdataignorefields)

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

[XUIObject](XUIObject.md).[addXporterInstanceXporter](XUIObject.md#addxporterinstancexporter)

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

#### Inherited from

[XUIObject](XUIObject.md).[animate](XUIObject.md#animate)

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

#### Inherited from

[XUIObject](XUIObject.md).[append](XUIObject.md#append)

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

#### Inherited from

[XUIObject](XUIObject.md).[attach](XUIObject.md#attach)

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

[XUIObject](XUIObject.md).[checkAndRunInternalFunction](XUIObject.md#checkandruninternalfunction)

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

[XUIObject](XUIObject.md).[clearAttributes](XUIObject.md#clearattributes)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:247

___

### click

▸ **click**(): `void`

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[click](XUIObject.md#click)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:419](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L419)

___

### dispose

▸ **dispose**(): `Promise`\<`void`\>

Dispose all object memory (destructor)

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XUIObject](XUIObject.md).[dispose](XUIObject.md#dispose)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:92](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L92)

___

### emptyDataSource

▸ **emptyDataSource**(): `void`

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[emptyDataSource](XUIObject.md#emptydatasource)

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

[XUIObject](XUIObject.md).[execute](XUIObject.md#execute)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:236

___

### getDOMObject

▸ **getDOMObject**(): `HTMLElement`

Gets the HTML DOM object, if the object is not created yet it will be created

#### Returns

`HTMLElement`

the HTML DOM object

#### Inherited from

[XUIObject](XUIObject.md).[getDOMObject](XUIObject.md#getdomobject)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:114](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L114)

___

### getHTML

▸ **getHTML**(): `string`

Gets the HTML representation of the object

#### Returns

`string`

the HTML representation of the object

#### Inherited from

[XUIObject](XUIObject.md).[getHTML](XUIObject.md#gethtml)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:186](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L186)

___

### hide

▸ **hide**(): `void`

This method is used to hide the object and trigger the onHide event

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[hide](XUIObject.md#hide)

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

[XUIObject](XUIObject.md).[init](XUIObject.md#init)

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

[XUIObject](XUIObject.md).[log](XUIObject.md#log)

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

#### Inherited from

[XUIObject](XUIObject.md).[mount](XUIObject.md#mount)

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

[XUIObject](XUIObject.md).[onCreate](XUIObject.md#oncreate)

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

[XUIObject](XUIObject.md).[onData](XUIObject.md#ondata)

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

[XUIObject](XUIObject.md).[onFrame](XUIObject.md#onframe)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:218

___

### onHide

▸ **onHide**(): `Promise`\<`void`\>

this method triggered when the XUIObject is hidden

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XUIObject](XUIObject.md).[onHide](XUIObject.md#onhide)

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

#### Inherited from

[XUIObject](XUIObject.md).[onMount](XUIObject.md#onmount)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:434](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L434)

___

### onShow

▸ **onShow**(): `Promise`\<`void`\>

this method triggered when the XUIObject is shown

#### Returns

`Promise`\<`void`\>

#### Inherited from

[XUIObject](XUIObject.md).[onShow](XUIObject.md#onshow)

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

[XUIObject](XUIObject.md).[parse](XUIObject.md#parse)

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

[XUIObject](XUIObject.md).[parseEvents](XUIObject.md#parseevents)

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

[XUIObject](XUIObject.md).[parseFields](XUIObject.md#parsefields)

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

[XUIObject](XUIObject.md).[parseFieldsFromXDataObject](XUIObject.md#parsefieldsfromxdataobject)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:159

___

### removeAllEventListeners

▸ **removeAllEventListeners**(): `void`

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[removeAllEventListeners](XUIObject.md#removealleventlisteners)

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

#### Inherited from

[XUIObject](XUIObject.md).[removeChild](XUIObject.md#removechild)

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

#### Inherited from

[XUIObject](XUIObject.md).[removeClass](XUIObject.md#removeclass)

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

[XUIObject](XUIObject.md).[removeEventListener](XUIObject.md#removeeventlistener)

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

#### Inherited from

[XUIObject](XUIObject.md).[replaceClass](XUIObject.md#replaceclass)

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

[XUIObject](XUIObject.md).[run](XUIObject.md#run)

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

#### Inherited from

[XUIObject](XUIObject.md).[setStyleAttribute](XUIObject.md#setstyleattribute)

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

#### Inherited from

[XUIObject](XUIObject.md).[setText](XUIObject.md#settext)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:265](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L265)

___

### show

▸ **show**(): `void`

This method is used to show the object and trigger the onShow event

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[show](XUIObject.md#show)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:341](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L341)

___

### stopAnimation

▸ **stopAnimation**(): `void`

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[stopAnimation](XUIObject.md#stopanimation)

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

[XUIObject](XUIObject.md).[toString](XUIObject.md#tostring)

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

[XUIObject](XUIObject.md).[toXData](XUIObject.md#toxdata)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:241

___

### toggle

▸ **toggle**(): `void`

This method is used to toggle the object visibility

#### Returns

`void`

#### Inherited from

[XUIObject](XUIObject.md).[toggle](XUIObject.md#toggle)

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

#### Inherited from

[XUIObject](XUIObject.md).[toggleClass](XUIObject.md#toggleclass)

#### Defined in

[web/xpell-ui/src/XUI/XUIObject.ts:306](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XUIObject.ts#L306)
