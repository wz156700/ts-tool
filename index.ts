/* 
不使用 ReturnType 实现 TypeScript 的 ReturnType<T> 泛型。
例如：
const fn = (v: boolean) => {
  if (v)
    return 1
  else
    return 2
}
type a = MyReturnType<typeof fn> // 应推导出 "1 | 2"

*/

type MyReturnType<T extends (...args: never[]) => unknown> = T extends (
  ...args: never[]
) => infer R
  ? R
  : never;

//类型定义创建了一个名为 MyReturnType 的类型，它接受一个泛型参数 T。
//这个泛型参数 T 必须是一个函数类型，这由 T extends (...args: never[]) => unknown 这部分约束。
//其中 (...args: never[]) => unknown 是一种函数类型，表示一个接受任意参数并返回任意类型的函数。
//然后，这个类型定义使用条件类型和类型推断来获取 T 的返回类型。
//条件类型的语法是 Type extends BaseType ? TrueType : FalseType，它表示如果 Type 是 BaseType 的子类型，那么结果类型是 TrueType，否则结果类型是 FalseType。
//在这个类型定义中，条件类型的判断部分 T extends (...args: never[]) => infer R 使用了类型推断语法 infer R。
//这表示如果 T 是一个接受任意参数并返回某种类型 R 的函数，那么 R 就是 T 的返回类型。如果 T 符合这个条件，那么结果类型是 R，否则结果类型是 never。
//因此，MyReturnType<T> 类型的作用是获取函数类型 T 的返回类型。这和 TypeScript 内置的 ReturnType<T> 类型的作用是一样的.

// 测试
const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type myType = MyReturnType<typeof fn>;

//tuple 转 union ，如：[string, number] -> string | number
type ElementOf<T> = T extends Array<infer E> ? E : never;
type TTuple = [string, number, boolean];
type ToUnion = ElementOf<TTuple>;

//union 转 intersection，如：T1 | T2 -> T1 & T2
type T1 = { name: string };
type T2 = { age: number };

type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;
type T20 = Bar<{ a: (x: string) => void; b: (x: string) => void }>; // string
type T21 = Bar<{ a: (x: T1) => void; b: (x: T2) => void }>; // T1 & T2

// 获取只读属性

// 实现泛型GetReadonlyKeys<T>，GetReadonlyKeys<T>返回由对象 T 所有只读属性的键组成的联合类型。

// 例如

// interface Todo {
//   readonly title: string
//   readonly description: string
//   completed: boolean
// }

// type Keys = GetReadonlyKeys<Todo> // expected to be "title" | "description"

// 检查类型X，Y 是否相等
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

type GetReadonlyKeys<
  T,
  U extends Readonly<T> = Readonly<T>,
  K extends keyof T = keyof T
> = K extends keyof T
  ? Equal<Pick<T, K>, Pick<U, K>> extends true
    ? K
    : never
  : never;
