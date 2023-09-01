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
/**
 * 这个类型利用了 TypeScript 的条件类型（T extends Array<infer E> ? E : never）和类型推断（infer E）来实现。
 * 我们来逐步分析：
 * T extends Array<infer E>：这部分是一个条件类型。如果 T 是一个数组类型，那么 TypeScript 将尝试推断数组元素的类型 E。
 * infer E：这部分是类型推断。TypeScript 会尝试从 Array<E> 中推断出 E 的类型。
 * ? E : never：这部分是条件类型的结果。如果 T 是一个数组类型，那么结果类型就是 E（数组的元素类型）。否则，结果类型就是 never。
 * 所以，ElementOf<T> 类型的作用就是获取数组类型 T 的元素类型
 */
type ElementOf<T> = T extends Array<infer E> ? E : never;
let TTuple = ["1", 2, true];
type ToUnion = ElementOf<typeof TTuple>;

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

// 检查类型X，Y 是否相等
type Equal<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// 这是一个条件类型，用于检查 X 和 Y 是否是相同的类型。
/** 它的运作方式是：基于条件类型检查，
 * 如果 X 和 Y 结构相同，那么 (<T>() => T extends X ? 1 : 2) 和 <T>() => T extends Y ? 1 : 2 的类型也会相同，
 * 此时结果是 true，否则结果为 false。
 **/

type GetReadonlyKeys<
  T,
  U extends Readonly<T> = Readonly<T>,
  K extends keyof T = keyof T
> = K extends keyof T
  ? Equal<Pick<T, K>, Pick<U, K>> extends true
    ? K
    : never
  : never;

/**
 * 这是一个用于获取类型 T 的所有只读属性的键的类型工具。
 * U extends Readonly<T> = Readonly<T> 是默认的泛型参数，它指示一个和 T 的结构相同但所有属性都被标记为 readonly 的类型。
 * K extends keyof T = keyof T 也是默认的泛型参数，它表示 T 的所有键。
 * GetReadonlyKeys<T> 的主体是一个映射类型和条件类型的组合：
 * 首先使用 K extends keyof T ? ... : never 迭代所有在 T 上的键。
 * 然后，对于每个键 K，我们都创建一个只包含这个键的新类型 Pick<T, K> 和 Pick<U, K>。如果 T 上的这个键是 readonly 的，那么 Pick<T, K> 和 Pick<U, K> 的类型应该是相同的。
 * 最后，Equal<Pick<T, K>, Pick<U, K>> extends true ? K : never 使用 Equal 类型来检查 Pick<T, K> 和 Pick<U, K> 是否相同。如果相同，返回键 K，否则返回 never。
 * 最终，GetReadonlyKeys<T> 类型将返回一个联合类型，包含 T 的所有只读键。
 * 值得注意的是，该类型工具只能检查直接定义在 T 中的只读属性，不能检查 T 的原型链上的只读属性。此外，由于 TypeScript 的结构类型系统的特性，该类型工具可能无法区分具有相同结构的属性。 */

interface Todo {
  readonly title: string;
  readonly description: string;
  completed: boolean;
}

type Keys = GetReadonlyKeys<Todo>; // expected to be "title" | "description"

// 实现Omit函数
type MyOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};

interface wlfTodo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description" | "title">;

const todo: TodoPreview = {
  completed: false,
};
