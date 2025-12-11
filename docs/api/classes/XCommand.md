[xpell-ui - v2.0.0-alpha.1](../README.md) / XCommand

# Class: XCommand

XCommand class - this command is being sent to the Xpell parser or every XModule/XObject for execution

## Table of contents

### Constructors

- [constructor](XCommand.md#constructor)

### Properties

- [\_module](XCommand.md#_module)
- [\_object](XCommand.md#_object)
- [\_op](XCommand.md#_op)
- [\_params](XCommand.md#_params)
- [d](XCommand.md#d)

### Methods

- [getParam](XCommand.md#getparam)

## Constructors

### constructor

• **new XCommand**(`data?`): [`XCommand`](XCommand.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `data?` | [`XCommandData`](../README.md#xcommanddata) |

#### Returns

[`XCommand`](XCommand.md)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:35

## Properties

### \_module

• **\_module**: `string`

The XModule to handle to command

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:16

___

### \_object

• `Optional` **\_object**: `string`

The XObject that should handle the command (optional - uses only to send XCommand to specific object)

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:20

___

### \_op

• **\_op**: `string`

The command operation (op/method) to execute

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:24

___

### \_params

• `Optional` **\_params**: `Object`

command parameters array

#### Index signature

▪ [k: `string`]: `string` \| `number` \| `Function`

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:28

___

### d

• **d**: `number`

XCommand create date timestamp

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:34

## Methods

### getParam

▸ **getParam**(`position`, `name`, `defaultValue`): `any`

Gets th parameter value from the XCommand whether it has a name or just a position
There are 2 ways to send XCommand with parameters:
 1. <module> <op> <param-0> <param-1> <param-2>     // position is for this case
 2. <module> <op> param-name:param-value            // name is for this case

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `position` | `number` | the position of the parameter if no name is send |
| `name` | `string` | the name of the parameter |
| `defaultValue` | `any` | the default value if none above exists |

#### Returns

`any`

the actual parameter value

#### Defined in

node_modules/.pnpm/xpell-core@1.0.1/node_modules/xpell-core/dist/XCommand.d.ts:46
