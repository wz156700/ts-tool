# ts-tool

## 简单的工具类类型

### 一 实现 自定义 Pick

#### 题目描述

不使用 Pick<T, K> ，实现 TS 内置的 Pick<T, K> 的功能。从类型 T 中选出符合 K 的属性，构造一个新的类型。

例如：

```
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyPick<Todo, 'title' | 'completed'>

const todo: TodoPreview = {
    title: 'Clean room',
    completed: false,
}
```

#### 答案：

```
type myPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

```

**答案解析：**

1. `myPick` 接收两个参数：

- `T`：是一个任意类型
- `K extends keyof T`：表示 K 是 T 的所有属性名的子集

2. `[key in K]: T[key];`:如果 key 在 K 中，便筛选出 T[key]

### 二 对象属性只读

#### 题目描述

不要使用内置的 Readonly<T>，自己实现一个。泛型 Readonly<T> 会接收一个 泛型参数，并返回一个完全一样的类型，只是所有属性都会是只读 (readonly) 的。也就是不可以再对该对象的属性赋值。
例如：

```
interface Todo {
  title: string
  description: string
}

const todo: MyReadonly<Todo> = {
  title: "Hey",
  description: "foobar"
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property

```

#### 答案

```
type myReadonly<T> = {
  readonly [key in keyof T]: T[key];
};
```

**答案解析：**

1. `myReadonly`: 接收一个泛型参数。
2. `readonly [key in keyof T]: T[key];`:给所有属性加上`readonly`

### 三 元组转换为对象

#### 题目描述：

将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应。
例如：

```
const tuple = ['tesla', 'model 3', 'model X', 'model Y'] as const

type result = TupleToObject<typeof tuple> // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}
```

#### 答案

```
type TupleToObject<T extends readonly (keyof any)[]> = {
  [key in T[number]]: key;
};
```

**答案解析**

1. `T extends readonly (keyof any)[]`: 表示 T 是一个`元组或数组类型`，其元素是`任何可能的属性名`（即，string 或 number 或 symbol）。

2. `[key in T[number]]: key;` 是一个映射类型，它遍历 T 中的每一项，将每一个元素值 key 映射为键，并且值也是元素值 key。

### 四 第一个元素

#### 题目描述

实现一个 First<T>泛型，它接受一个`数组T`并返回它的第一个元素的类型。

例如：

```
type arr1 = ['a', 'b', 'c']
type arr2 = [3, 2, 1]

type head1 = First<arr1> // 应推导出 'a'
type head2 = First<arr2> // 应推导出 3
```

#### 答案

```
type First<T extends (keyof any)[]> = T[0];
```

**答案解析**

1. `T extends (keyof any)[]`:T 接收一个元素为任意类型的数组
2. 返回 T[0]

### 五 获取元组长度

#### 题目描述

创建一个 Length 泛型，这个泛型接受一个`只读的元组`，返回这个元组的长度。

例如：

```
type tesla = ['tesla', 'model 3', 'model X', 'model Y']
type spaceX = ['FALCON 9', 'FALCON HEAVY', 'DRAGON', 'STARSHIP', 'HUMAN SPACEFLIGHT']

type teslaLength = Length<tesla> // expected 4
type spaceXLength = Length<spaceX> // expected 5
```

#### 答案

```
type Length<T extends Readonly<Array<any>>> = T["length"];
```

**答案解析：**

1. `T extends Readonly<Array<any>>`:T 为只读类型的数组
2. `T["length"]`:返回 T 的长度

### 六 实现 Exclude

#### 题目描述

实现内置的 Exclude<T, U> 类型，但不能直接使用它本身。

`从联合类型 T 中排除 U 中的类型，来构造一个新的类型。`

例如：

```
type Result = MyExclude<'a' | 'b' | 'c', 'a'> // 'b' | 'c'
```

#### 答案

```
type MyExclude<T, U> = T extends U ? never : T;
```

**答案解析**

1. T 和 U 是任意类型。
2. `T extends U ? never` : 如果 T 可以赋值给 U，则结果类型是 never，否则结果类型是 T。

### 七 Awaited

#### 题目描述

假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。

例如：Promise<ExampleType>，请你返回 ExampleType 类型。

```
type ExampleType = Promise<string>

type Result = MyAwaited<ExampleType> // string
```

#### 答案

```
type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U>
? U extends PromiseLike<any>
? MyAwaited<U>
: U
: never;
```

**答案解析**

1. `T extends PromiseLike<any>`: 表示 T 是一个 `Promise` 或 `类 Promise` 类型。
2. `T extends PromiseLike<infer U> ? U : never`: 是一个条件类型，如果 T 是一个 Promise 类型，则结果类型是 Promise 的返回值类型 U，否则结果类型是 never。
3. `U extends PromiseLike<any> ? MyAwaited<U> `: U 是一个条件类型，如果 U 仍然是一个 Promise 类型，则递归调用 MyAwaited 类型来提取返回值类型，否则结果类型就是 U。

### 八 If

#### 题目描述

实现一个 `IF` 类型，它接收一个`条件类型 C` ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 `C 只能是 true 或者 false， T 和 F 可以是任意类型`。

例如：

```
type A = If<true, 'a', 'b'> // expected to be 'a'
type B = If<false, 'a', 'b'> // expected to be 'b'
```

#### 答案

```
type If<C extends Boolean, T, F> = C extends true ? T : F;
```

**答案解析**

1. `C extends Boolean` :表示 C 是一个布尔类型，可以是 true 或 false。
2. `T` 和 `F` :是任意类型。
3. `C extends true ? T : F`: 是一个条件类型，如果 C 是 true，则结果类型是 T，否则结果类型是 F。

### 九 Concat

#### 题目描述

在类型系统里实现 JavaScript 内置的 Array.concat 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组。

例如：

```
type Result = Concat<[1], [2]> // expected to be [1, 2]
```

#### 答案

```
type Concat<T extends any[], U extends any[]> = [...T, ...U];

```

**答案解析**

1. `T extends any[], U extends any[]`:T，U 为任意类型的数组
2. `[...T, ...U]`:将 T，U 结构后放入同一个数组并返回

### 十 Includes

#### 题目描述

在类型系统里实现 JavaScript 的 Array.includes 方法，这个类型接受两个参数，返回的类型要么是 true 要么是 false。

例如：

```
type isPillarMen = Includes<['Kars', 'Esidisi', 'Wamuu', 'Santana'], 'Dio'> // expected to be `false`
```

#### 答案：

```
type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Last
]
  ? myEqual<U, First> extends true
    ? true
    : Includes<Last, U>
  : false;

```

**答案解析**

1. `T extends readonly any[]` 表示 T 是一个只读的元组或数组类型。
2. `U` 是任意类型。
3. `T extends [infer First, ...infer Last]`: 是一个条件类型和类型推断的组合，如果 T 是一个非空的元组或数组类型，则 First 是 T 的第一个元素的类型，Last 是 T 的剩余元素的类型组成的元组。
4. `myEqual<U, First> extends true ? true : Includes<Last, U> `:是一个条件类型，如果 U 和 First 是相同的类型，则结果类型是 true，否则`递归检查 U 是否在 Last 中`。

### 十一 Push

#### 题目描述

在类型系统里实现通用的 Array.push 。

例如：

```
type Result = Push<[1, 2], '3'> // [1, 2, '3']
```

#### 答案

```
type Push<T extends any[], U> = [...T, U];
```

**答案解析**

1. `T extends any[]`:T 为任意类型的数组
2. `[...T, U]`:将 T 展开与 U 放在同一个数组

### 十二 unshift。

#### 题目描述

实现类型版本的 Array.unshift。

```
type Result5 = Unshift<[1, 2], 0>; // [0, 1, 2,]
```

#### 答案

```
type Unshift<T extends any[], U> = [U, ...T];
```

**答案解析**

1. `T extends any[]`:T 为任意类型的数组
2. `[U, ...T]`:将 T 展开与 U 放在同一个数组

### 十三 Parameters

#### 题目描述

实现内置的 `Parameters` 类型，而不是直接使用它，可参考 TypeScript 官方文档。

例如：

```
const foo = (arg1: string, arg2: number): void => {}

type FunctionParamsType = MyParameters<typeof foo> // [arg1: string, arg2: number]
```

#### 答案

```
type MyParameters<T extends (...agrs: any) => any> = T extends (
  ...args: infer S
) => any
  ? S
  : any;

```

**答案解析**

1. `T extends (...args: any) => any`: 表示 T 是一个`函数类型`。
2. `T extends (...args: infer S) => any ? S : any`: 是一个条件类型和类型推断的组合，`如果 T 是一个函数类型，则结果类型是函数的参数类型列表 S，否则结果类型是 any`。

### 十四 shift

#### 题目描述

实现类型版本的 Array.shift。

#### 答案

```
type shift<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest
  : never;

```

**答案解析**

1. `T extends any[]` 表示 T 是一个`元组`或`数组类型`。
2. `T extends [infer First, ...infer Rest] ? Rest : never `:是一个条件类型和类型推断的组合，如果 `T 是一个非空的元组或数组类型，则 First 是 T 的第一个元素的类型，Rest 是 T 的剩余元素的类型组成的元组`。结果类型是 `Rest`，否则结果类型是` never`。

### 十五 pop

#### 题目描述

实现类型版本的 Array.pop。

#### 答案

```
type shift<T extends any[]> = T extends [...infer Rest, infer last]
  ? Rest
  : never;

```

**答案解析**

1. `T extends any[]` 表示 T 是一个`元组`或`数组类型`。
2. `T extends [...infer Rest, infer last] ? Rest : never `:是一个条件类型和类型推断的组合，如果 `T 是一个非空的元组或数组类型，则 Rest 是 T last 是 T 的最后一个元素`。结果类型是 `Rest`，否则结果类型是` never`。
