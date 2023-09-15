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
