## 前言

之前我们完成了简单部分的 15 道工具函数的学习，接下来我们来学习下中等难度的工具函数的编写。

## 题目

### 实现自定义 ReturnType

**题目描述：**

不使用 ReturnType 实现 TypeScript 的 ReturnType<T> 泛型。

例如：

```
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}

type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"
```

**答案**

```
type MyReturnType<T extends Function> = T extends (...arg: any) => infer R
  ? R
  : never;

```

**答案解析**

1. T extends Function：T 限制为一个函数
2. T extends (...arg: any) => infer R? R: never：判断 T 是否是一个接收任意类型参数，并返回返回值的函数，`infer R`:通过`infer`推断函数返回值类型。`T extends (...arg: any) => infer R`若为 true,返回函数返回值类型，否则返回 never。

### 实现自定义 Omit

**题目描述**

不使用 Omit 实现 TypeScript 的 Omit<T, K> 泛型。

Omit 会创建一个省略 K 中字段的 T 对象。

例如：

```
interface Todo {
  title: string
  description: string
  completed: boolean
}

type TodoPreview = MyOmit<Todo, 'description' | 'title'>

const todo: TodoPreview = {
  completed: false,
}

```

**答案**

```
type MyOmit<T, U> = {
  [key in keyof T as key extends U ? never : key]: T[key];
};
```

**答案解析**

1. T:表示传入的对象，U:标识需要删除的属性
2. [key in keyof T as key extends U ? never : key]：表示对象的键，筛选键的规则为筛选出 U 中不存在键。
3. T[key]：标识 key 对应的值

### 对象部分属性只读

**题目描述**

实现一个泛型 MyReadonly2<T, K>，它带有两种类型的参数 T 和 K。

类型 K 指定 T 中要被设置为只读 (readonly) 的属性。如果未提供 K，则应使所有属性都变为只读，就像普通的 Readonly<T>一样。

例如:

```
interface Todo {
  title: string
  description: string
  completed: boolean
}

const todo: MyReadonly2<Todo, 'title' | 'description'> = {
  title: "Hey",
  description: "foobar",
  completed: false,
}

todo.title = "Hello" // Error: cannot reassign a readonly property
todo.description = "barFoo" // Error: cannot reassign a readonly property
todo.completed = true // OK

```

**答案**

```
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> &
  Omit<T, K>;
```

**答案解析**

1. T:表示传入的对象，K:表示需要变成只读的属性
2. Readonly<Pick<T, K>>：从 T 中选出 K 中包含的属性
3. Omit<T, K>：从 T 中选择 K 中不包含的属性
4. Readonly<Pick<T, K>> & Omit<T, K> :使用 `&`关联起来，表示最后返回的对象是为两部分选择的集合。

### 对象属性只读（递归）

**题目描述**
实现一个泛型 DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。

您可以假设在此挑战中我们仅处理对象。不考虑数组、函数、类等。但是，您仍然可以通过覆盖尽可能多的不同案例来挑战自己。

例如:

```
type X = {
  x: {
    a: 1
    b: 'hi'
  }
  y: 'hey'
}

type Expected = {
  readonly x: {
    readonly a: 1
    readonly b: 'hi'
  }
  readonly y: 'hey'
}

type Todo = DeepReadonly<X> // should be same as Expected

```

**答案**

```
type DeepReadonly<T> = keyof T extends never
  ? T
  : {
      readonly [key in keyof T]: DeepReadonly<T[key]>;
    };

```

**答案解析**

1. 判断 T 是否存在，不存在直接返回 T,存在则直接添加 readonly 并且递归下去。

### 元组转合集

**元组**：元组（Tuple）是一种特殊的数组类型，它允许存储不同类型的元素，并且对元素的数量和类型进行了严格的限制。

**题目描述**
实现泛型 TupleToUnion<T>，它返回元组所有值的合集。

例如

```
type Arr = ['1', '2', '3']

type Test = TupleToUnion<Arr> // expected to be '1' | '2' | '3'

```

**答案**

```
type TupleToUnion<T> = T extends Array<infer U> ? U : never;
```

**答案解析**

1. 通过 infer 推断出元素的类型，然后返回。
