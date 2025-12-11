[xpell-ui - v2.0.0-alpha.1](../README.md) / XObject

# Class: XObject

XObject class
 XObject

## Hierarchy

- **`XObject`**

  ↳ [`XUIObject`](XUIObject.md)

## Indexable

▪ [k: `string`]: `string` \| ``null`` \| [] \| `undefined` \| `Function` \| `boolean` \| `number` \| {} \| ``null``

## Table of contents

### Constructors

- [constructor](XObject.md#constructor)

### Properties

- [\_cache\_cmd\_txt](XObject.md#_cache_cmd_txt)
- [\_cache\_jcmd](XObject.md#_cache_jcmd)
- [\_children](XObject.md#_children)
- [\_data\_source](XObject.md#_data_source)
- [\_debug](XObject.md#_debug)
- [\_event\_listeners\_ids](XObject.md#_event_listeners_ids)
- [\_id](XObject.md#_id)
- [\_name](XObject.md#_name)
- [\_nano\_commands](XObject.md#_nano_commands)
- [\_on](XObject.md#_on)
- [\_on\_create](XObject.md#_on_create)
- [\_on\_data](XObject.md#_on_data)
- [\_on\_event](XObject.md#_on_event)
- [\_on\_frame](XObject.md#_on_frame)
- [\_on\_mount](XObject.md#_on_mount)
- [\_once](XObject.md#_once)
- [\_parent](XObject.md#_parent)
- [\_process\_data](XObject.md#_process_data)
- [\_process\_frame](XObject.md#_process_frame)
- [\_type](XObject.md#_type)
- [\_xem\_options](XObject.md#_xem_options)
- [\_xporter](XObject.md#_xporter)

### Methods

- [addChild](XObject.md#addchild)
- [addEventListener](XObject.md#addeventlistener)
- [addNanoCommand](XObject.md#addnanocommand)
- [addNanoCommandPack](XObject.md#addnanocommandpack)
- [addXporterDataIgnoreFields](XObject.md#addxporterdataignorefields)
- [addXporterInstanceXporter](XObject.md#addxporterinstancexporter)
- [append](XObject.md#append)
- [checkAndRunInternalFunction](XObject.md#checkandruninternalfunction)
- [clearAttributes](XObject.md#clearattributes)
- [dispose](XObject.md#dispose)
- [emptyDataSource](XObject.md#emptydatasource)
- [execute](XObject.md#execute)
- [init](XObject.md#init)
- [log](XObject.md#log)
- [onCreate](XObject.md#oncreate)
- [onData](XObject.md#ondata)
- [onFrame](XObject.md#onframe)
- [onMount](XObject.md#onmount)
- [parse](XObject.md#parse)
- [parseEvents](XObject.md#parseevents)
- [parseFields](XObject.md#parsefields)
- [parseFieldsFromXDataObject](XObject.md#parsefieldsfromxdataobject)
- [removeAllEventListeners](XObject.md#removealleventlisteners)
- [removeChild](XObject.md#removechild)
- [removeEventListener](XObject.md#removeeventlistener)
- [run](XObject.md#run)
- [toString](XObject.md#tostring)
- [toXData](XObject.md#toxdata)

## Constructors

### constructor

• **new XObject**(`data`, `defaults?`, `skipParse?`): [`XObject`](XObject.md)

XObject constructor is creating the object and adding all the data keys to the XObject instance

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `data` | [`XObjectData`](../README.md#xobjectdata) | constructor input data (object) |
| `defaults?` | `any` | defaults to merge with data |
| `skipParse?` | `boolean` | skip data parsing if override this method make sure to call super.init(data,skipParse) and to set skipParse to true |

#### Returns

[`XObject`](XObject.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:108

## Properties

### \_cache\_cmd\_txt

• `Protected` `Optional` **\_cache\_cmd\_txt**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:95

___

### \_cache\_jcmd

• `Protected` `Optional` **\_cache\_jcmd**: `any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:96

___

### \_children

• **\_children**: ([`XObject`](XObject.md) \| [`XObjectData`](../README.md#xobjectdata))[]

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:77

___

### \_data\_source

• `Optional` **\_data\_source**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:80

___

### \_debug

• `Optional` **\_debug**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:81

___

### \_event\_listeners\_ids

• `Protected` **\_event\_listeners\_ids**: `Object`

#### Index signature

▪ [eventName: `string`]: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:97

___

### \_id

• **\_id**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:75

___

### \_name

• `Optional` **\_name**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:79

___

### \_nano\_commands

• `Protected` **\_nano\_commands**: `Object`

#### Index signature

▪ [k: `string`]: [`XNanoCommand`](../interfaces/XNanoCommand.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:92

___

### \_on

• **\_on**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:82

___

### \_on\_create

• `Optional` **\_on\_create**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:84

___

### \_on\_data

• `Optional` **\_on\_data**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:87

___

### \_on\_event

• `Optional` **\_on\_event**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:88

___

### \_on\_frame

• `Optional` **\_on\_frame**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:86

___

### \_on\_mount

• `Optional` **\_on\_mount**: `string` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:85

___

### \_once

• **\_once**: [`XObjectOnEventIndex`](../interfaces/XObjectOnEventIndex.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:83

___

### \_parent

• **\_parent**: ``null`` \| [`XObject`](XObject.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:78

___

### \_process\_data

• **\_process\_data**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:90

___

### \_process\_frame

• **\_process\_frame**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:89

___

### \_type

• **\_type**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:76

___

### \_xem\_options

• `Protected` **\_xem\_options**: [`XEventListenerOptions`](../README.md#xeventlisteneroptions)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:91

___

### \_xporter

• `Protected` **\_xporter**: [`XDataXporter`](../README.md#xdataxporter)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:100

## Methods

### addChild

▸ **addChild**(`child`): `void`

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | [`XObject`](XObject.md) | the child to add |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:261

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:142

___

### append

▸ **append**(`xobject`): `void`

Append a child XObject to this XObject

#### Parameters

| Name | Type |
| :------ | :------ |
| `xobject` | [`XObject`](XObject.md) |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:125

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:247

___

### dispose

▸ **dispose**(): `Promise`\<`void`\>

Dispose the XObject and all its children

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:251

___

### emptyDataSource

▸ **emptyDataSource**(): `void`

#### Returns

`void`

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:236

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:109

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:218

___

### onMount

▸ **onMount**(): `Promise`\<`void`\>

Triggers when the object is being mounted to other element
support external _on_create anonymous function in the , example:
_on_mount: async (xObject) => {
     // xObject -> The XObject parent of the _on_mount function, use instead of this keyword
     // write code that will be executed each frame.
     // make sure to write async anonymous function.
}

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:190

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:159

___

### removeAllEventListeners

▸ **removeAllEventListeners**(): `void`

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:120

___

### removeChild

▸ **removeChild**(`child`, `dispose?`): `void`

Remove a child from the XObject )

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `child` | [`XObject`](XObject.md) | the child to |
| `dispose?` | `boolean` | - |

#### Returns

`void`

void

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:257

___

### removeEventListener

▸ **removeEventListener**(`eventName`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `eventName` | `string` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:119

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

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:224

___

### toString

▸ **toString**(): `string`

Return a string representation of the XObject

#### Returns

`string`

string

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:246

___

### toXData

▸ **toXData**(): [`IXData`](../interfaces/IXData.md)

Return an IXObjectData JSON representation of the XObject

#### Returns

[`IXData`](../interfaces/IXData.md)

IXObjectData

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XObject.d.ts:241
