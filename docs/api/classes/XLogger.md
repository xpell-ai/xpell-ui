[xpell-ui - v2.0.0-alpha.1](../README.md) / \_XLogger

# Class: \_XLogger

XLoggerEngine Xpell Logger engine

## Table of contents

### Constructors

- [constructor](XLogger.md#constructor)

### Properties

- [\_debug](XLogger.md#_debug)
- [\_enabled](XLogger.md#_enabled)
- [\_show\_date](XLogger.md#_show_date)
- [\_show\_time](XLogger.md#_show_time)

### Methods

- [debug](XLogger.md#debug)
- [error](XLogger.md#error)
- [log](XLogger.md#log)

## Constructors

### constructor

• **new _XLogger**(): [`_XLogger`](XLogger.md)

#### Returns

[`_XLogger`](XLogger.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:21

## Properties

### \_debug

• **\_debug**: `boolean`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:20

___

### \_enabled

• **\_enabled**: `boolean`

Enable logger activity if false no logs will be displayed

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:11

___

### \_show\_date

• **\_show\_date**: `boolean`

Show the date in every log message

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:15

___

### \_show\_time

• **\_show\_time**: `boolean`

Show the Time in every log message

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:19

## Methods

### debug

▸ **debug**(`message?`, `...optionalParams`): `void`

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:39

___

### error

▸ **error**(`message?`, `...optionalParams`): `void`

Log an error message to the output log (console)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message?` | `any` | message to present |
| `...optionalParams` | `any`[] |  |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:38

___

### log

▸ **log**(`message?`, `...optionalParams`): `void`

Log a message to the output log (console)

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `message?` | `any` | message to present |
| `...optionalParams` | `any`[] |  |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XLogger.d.ts:32
