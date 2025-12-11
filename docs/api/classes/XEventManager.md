[xpell-ui - v2.0.0-alpha.1](../README.md) / \_XEventManager

# Class: \_XEventManager

XEventDispatcher is the system event dispatcher and manager

## Table of contents

### Constructors

- [constructor](XEventManager.md#constructor)

### Properties

- [\_events](XEventManager.md#_events)
- [\_html\_event\_listeners](XEventManager.md#_html_event_listeners)
- [\_listeners\_to\_event\_index](XEventManager.md#_listeners_to_event_index)
- [\_log\_rules](XEventManager.md#_log_rules)

### Methods

- [fire](XEventManager.md#fire)
- [on](XEventManager.md#on)
- [onEvent](XEventManager.md#onevent)
- [once](XEventManager.md#once)
- [remove](XEventManager.md#remove)
- [removeEvent](XEventManager.md#removeevent)

## Constructors

### constructor

• **new _XEventManager**(): [`_XEventManager`](XEventManager.md)

#### Returns

[`_XEventManager`](XEventManager.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:42

## Properties

### \_events

• `Protected` **\_events**: `Object`

#### Index signature

▪ [name: `string`]: [`XEventListener`](../interfaces/XEventListener.md)[]

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:35

___

### \_html\_event\_listeners

• `Protected` **\_html\_event\_listeners**: [`HTMLEventListenersIndex`](../README.md#htmleventlistenersindex)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:41

___

### \_listeners\_to\_event\_index

• `Protected` **\_listeners\_to\_event\_index**: `Object`

#### Index signature

▪ [listernerId: `string`]: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:38

___

### \_log\_rules

• **\_log\_rules**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `fire` | `any` |
| `register` | `boolean` |
| `remove` | `boolean` |

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:30

## Methods

### fire

▸ **fire**(`eventName`, `data?`, `callObject?`): `Promise`\<`void`\>

This method is used to fire an event

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | the name of the event |
| `data?` | `any` | the data to pass to the event |
| `callObject?` | `any` | - |

#### Returns

`Promise`\<`void`\>

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:93

___

### on

▸ **on**(`eventName`, `listener`, `options?`, `callObject?`): `string`

This method listen to event name and register the listener function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | event name to listen to |
| `listener` | `Function` | listener function to be called when event fired |
| `options?` | [`XEventListenerOptions`](../README.md#xeventlisteneroptions) | - |
| `callObject?` | `any` | - |

#### Returns

`string`

listener id

**`Example`**

```ts
// listen to event name "my-event" and display the event data to the console when fired
   _xem.on("my-event",(data)=>{
        console.log("XEM Event " + data)
   })
```

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:66

___

### onEvent

▸ **onEvent**(`eventName`, `listener`, `options?`, `callObj?`): `string`

This method listen to event name and register the listener function

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | event name to listen to |
| `listener` | `Function` | listener function to be called when event fired |
| `options?` | [`XEventListenerOptions`](../README.md#xeventlisteneroptions) | - |
| `callObj?` | `any` | - |

#### Returns

`string`

listener id

**`Example`**

```ts
// listen to event name "my-event" and display the event data to the console when fired
   _xem.on("my-event",(data)=>{
        console.log("XEM Event " + data)
   })
```

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:54

___

### once

▸ **once**(`eventName`, `listener`, `callObject?`): `string`

This method listen to event name and register the listener function
The listener will be removed after first fire

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `eventName` | `string` | event name to listen to |
| `listener` | `Function` | listener function to be called when event fired |
| `callObject?` | `any` | - |

#### Returns

`string`

listener id

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:74

___

### remove

▸ **remove**(`listenerId`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `listenerId` | `string` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:85

___

### removeEvent

▸ **removeEvent**(`listenerId`): `void`

This method remove listener by listener id

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `listenerId` | `string` | listener id to remove |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XEventManager.d.ts:79
