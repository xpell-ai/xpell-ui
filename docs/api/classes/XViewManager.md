[xpell-ui - v2.0.0-alpha.1](../README.md) / XViewManager

# Class: XViewManager

## Table of contents

### Constructors

- [constructor](XViewManager.md#constructor)

### Properties

- [\_log\_rules](XViewManager.md#_log_rules)

### Accessors

- [\_active\_view](XViewManager.md#_active_view)
- [\_default\_parent\_element](XViewManager.md#_default_parent_element)
- [\_id](XViewManager.md#_id)

### Methods

- [addRawView](XViewManager.md#addrawview)
- [addView](XViewManager.md#addview)
- [addViewPack](XViewManager.md#addviewpack)
- [createView](XViewManager.md#createview)
- [getView](XViewManager.md#getview)
- [hasView](XViewManager.md#hasview)
- [hidePage](XViewManager.md#hidepage)
- [hideView](XViewManager.md#hideview)
- [init](XViewManager.md#init)
- [loadPage](XViewManager.md#loadpage)
- [onBrowserUrlHashChanged](XViewManager.md#onbrowserurlhashchanged)
- [showPage](XViewManager.md#showpage)
- [showView](XViewManager.md#showview)

## Constructors

### constructor

• **new XViewManager**(): [`XViewManager`](XViewManager.md)

#### Returns

[`XViewManager`](XViewManager.md)

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:34](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L34)

## Properties

### \_log\_rules

• **\_log\_rules**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `_create` | `boolean` |
| `_init` | `boolean` |

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:22](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L22)

## Accessors

### \_active\_view

• `get` **_active_view**(): ``null`` \| `string`

#### Returns

``null`` \| `string`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:40](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L40)

___

### \_default\_parent\_element

• `get` **_default_parent_element**(): `string`

#### Returns

`string`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:41](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L41)

___

### \_id

• `get` **_id**(): `string`

#### Returns

`string`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:39](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L39)

## Methods

### addRawView

▸ **addRawView**(`viewName`, `viewData`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `viewName` | `string` |
| `viewData` | [`XObjectData`](../README.md#xobjectdata) |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:112](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L112)

___

### addView

▸ **addView**(`view`, `viewName`): `void`

Adds an instance of a view (XView) to the View Manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `view` | [`XUIObjects`](XUIObjects.md) | The view instance |
| `viewName` | `string` | The view name |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:82](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L82)

___

### addViewPack

▸ **addViewPack**(`vuz`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `vuz` | [`XViewsPack`](../README.md#xviewspack) |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:104](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L104)

___

### createView

▸ **createView**(`viewData`, `auto_add?`): `Promise`\<[`XUIObject`](XUIObject.md)\>

Creates new SpellView

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `viewData` | [`XObjectData`](../README.md#xobjectdata) | `undefined` |  |
| `auto_add` | `boolean` | `true` | if true and the view data (view_data) contains a "name" string the new view will be added automatically to the view manager |

#### Returns

`Promise`\<[`XUIObject`](XUIObject.md)\>

**`Description`**

turns view-data (JSON) to a spell object

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:61](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L61)

___

### getView

▸ **getView**(`viewName`): [`XUIObjects`](XUIObjects.md)

Retrieve the view instance from the View Manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `viewName` | `string` | The view name to retrieve |

#### Returns

[`XUIObjects`](XUIObjects.md)

XView

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:91](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L91)

___

### hasView

▸ **hasView**(`viewName`): `boolean`

Checks if there is an instance of a view in the View Manager

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `viewName` | `string` | The view name |

#### Returns

`boolean`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:100](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L100)

___

### hidePage

▸ **hidePage**(`viewName`): `void`

Hide the active page and the page URL

#### Parameters

| Name | Type |
| :------ | :------ |
| `viewName` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:187](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L187)

___

### hideView

▸ **hideView**(`viewName`): `void`

Show view on screen

#### Parameters

| Name | Type |
| :------ | :------ |
| `viewName` | `string` |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:176](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L176)

___

### init

▸ **init**(): `void`

Initialized the View Manager and register "hashchange" event on the window to control the url string

#### Returns

`void`

**`Fire`**

"xui-vm-loaded" event

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:47](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L47)

___

### loadPage

▸ **loadPage**(`defaultViewName`): `void`

Load page (entire screen) on top of the active page
This method handles the first routing where the view name is in the url (http://server:port/#view-name)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `defaultViewName` | `string` | this param is the default view to load in case the url param is empty |

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:121](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L121)

___

### onBrowserUrlHashChanged

▸ **onBrowserUrlHashChanged**(): `void`

handle the hashchange browser event, used to support Back functionality.

#### Returns

`void`

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:139](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L139)

___

### showPage

▸ **showPage**(`viewName`): `Promise`\<[`XUIObjects`](XUIObjects.md)\>

Show view as page (set as active view and dismiss former active)

#### Parameters

| Name | Type |
| :------ | :------ |
| `viewName` | `string` |

#### Returns

`Promise`\<[`XUIObjects`](XUIObjects.md)\>

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:197](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L197)

___

### showView

▸ **showView**(`viewName`): `Promise`\<`void`\>

Show view on screen

#### Parameters

| Name | Type |
| :------ | :------ |
| `viewName` | `string` |

#### Returns

`Promise`\<`void`\>

#### Defined in

[web/xpell-ui/src/XUI/XViewManager.ts:158](https://github.com/AimeVerse/xpell-ui/blob/7369fefd7ffa5ca685b1214ce3f7d159e24d01fc/src/XUI/XViewManager.ts#L158)
