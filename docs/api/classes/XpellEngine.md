[xpell-ui - v2.0.0-alpha.1](../README.md) / XpellEngine

# Class: XpellEngine

Xpell main engine

## Table of contents

### Constructors

- [constructor](XpellEngine.md#constructor)

### Properties

- [\_engine\_id](XpellEngine.md#_engine_id)
- [\_frame\_number](XpellEngine.md#_frame_number)
- [\_log\_rules](XpellEngine.md#_log_rules)
- [\_version](XpellEngine.md#_version)
- [parser](XpellEngine.md#parser)

### Accessors

- [verbose](XpellEngine.md#verbose)

### Methods

- [delay](XpellEngine.md#delay)
- [execute](XpellEngine.md#execute)
- [getModule](XpellEngine.md#getmodule)
- [getParam](XpellEngine.md#getparam)
- [info](XpellEngine.md#info)
- [loadModule](XpellEngine.md#loadmodule)
- [loadModules](XpellEngine.md#loadmodules)
- [log](XpellEngine.md#log)
- [onFrame](XpellEngine.md#onframe)
- [run](XpellEngine.md#run)
- [start](XpellEngine.md#start)

## Constructors

### constructor

• **new XpellEngine**(): [`XpellEngine`](XpellEngine.md)

#### Returns

[`XpellEngine`](XpellEngine.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:29

## Properties

### \_engine\_id

• **\_engine\_id**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:23

___

### \_frame\_number

• **\_frame\_number**: `number`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:24

___

### \_log\_rules

• **\_log\_rules**: `Object`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:25

___

### \_version

• **\_version**: `string`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:22

___

### parser

• **parser**: typeof [`XParser`](XParser.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:28

## Accessors

### verbose

• `set` **verbose**(`val`): `void`

Enable Xpell logs to console

#### Parameters

| Name | Type |
| :------ | :------ |
| `val` | `boolean` |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:33

## Methods

### delay

▸ **delay**(`ms`): `Promise`\<`unknown`\>

Delay the execution of the next command

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ms` | `number` | delay in milliseconds |

#### Returns

`Promise`\<`unknown`\>

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:47

___

### execute

▸ **execute**(`xcmd`): `any`

Execute Xpell Command

#### Parameters

| Name | Type |
| :------ | :------ |
| `xcmd` | [`XCommand`](XCommand.md) |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:71

___

### getModule

▸ **getModule**(`moduleName`): [`XModule`](XModule.md)

Gets Xpell module by name

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `moduleName` | `string` | name of the loaded module |

#### Returns

[`XModule`](XModule.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:82

___

### getParam

▸ **getParam**(`name`, `defaultValue?`): `any`

#### Parameters

| Name | Type |
| :------ | :------ |
| `name` | `string` |
| `defaultValue?` | `string` |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:87

___

### info

▸ **info**(): `void`

Display information about the Xpell engine to the console

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:61

___

### loadModule

▸ **loadModule**(`xModule`): `void`

Loads Xpell module into the engine

#### Parameters

| Name | Type |
| :------ | :------ |
| `xModule` | [`XModule`](XModule.md) |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:52

___

### loadModules

▸ **loadModules**(`...xModulesArray`): `void`

Loads multiple module at ones

#### Parameters

| Name | Type |
| :------ | :------ |
| `...xModulesArray` | [`XModule`](XModule.md)[] |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:57

___

### log

▸ **log**(`message?`, `...optionalParams`): `void`

Logs message to console using Xpell logger
make sure to enable verbose mode to see the logs
this method is a wrapper for XLogger.log

#### Parameters

| Name | Type |
| :------ | :------ |
| `message?` | `any` |
| `...optionalParams` | `any`[] |

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:41

___

### onFrame

▸ **onFrame**(): `void`

Main onFrame method
calls all the sub-modules onFrame methods (if implemented)

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:76

___

### run

▸ **run**(`stringXCommand`): `any`

Run textual xCommand -

#### Parameters

| Name | Type |
| :------ | :------ |
| `stringXCommand` | `string` |

#### Returns

`any`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:66

___

### start

▸ **start**(): `void`

Start Xpell engine for web browsers using requestAnimationFrame

#### Returns

`void`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/Xpell.d.ts:86
