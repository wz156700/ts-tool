// 1. 推到函数返回类型
/**
 * T必须是一个函数：由 T extends (...args : never[] )=> unknown 决定的
 * 使用类型推断来推断函数的返回值类型: infer R
 * T extends (...args: never[]) => infer R ? R : never;
 * 如果T是(...args: never[]) => infer R 的格式的话，返回它的返回值类型。若不是直接返回never
 */
type MyselfReturnType<T extends (...args: never[]) => unknown> = T extends (
  ...args: never[]
) => infer R
  ? R
  : never;

// 测试
const myFn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type test = MyselfReturnType<typeof myFn>;

//2. 获取数组元素类型 cehi+
/**
 * T 必须是一个数组，由 T extends Array<any> 决定的
 * 条件判断：T extends Array<infer E>，如果 T 是一个类型数组，返回数组的元素类型E,否则返回never
 *
 */
type myselfElementOf<T extends Array<any>> = T extends Array<infer E>
  ? E
  : never;

let myArr = [1, "2", true];
type test2 = myselfElementOf<typeof myArr>;

//3. union 转 intersection，如：T1 | T2 -> T1 & T2

type myBar<T> = T extends { a: (x: infer U) => void; b: (y: infer U) => void }
  ? U
  : never;

type myTest = myBar<{ a: (x: string) => void; b: (y: string) => void }>;

// 测试

let a = { name: "wlf" };
let b = { age: 25 };

type c = { name: string };
type d = { age: number };

type myTest2 = myBar<{ a: (x: typeof a) => void; b: (y: typeof b) => void }>;
type myTest3 = myBar<{ a: (x: c) => void; b: (y: d) => void }>;

// 4. 检查两个类型是否相等
type myEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y
  ? 1
  : 2
  ? true
  : false;

// 测试
type e = { name: { myname: "wlf" } };
type f = { age: { age: "25" } };

type test3 = myEqual<e, f>;

// 5. 获取只读属性
type myGetReadonlyKeys<
  T,
  U extends Readonly<T> = Readonly<T>,
  K extends keyof T = keyof T
> = K extends keyof T
  ? myEqual<Pick<T, K>, Pick<U, K>> extends true
    ? K
    : never
  : never;

// 测试
interface myTodo {
  readonly title: string;
  readonly description: string;
  readonly completed: boolean;
}

type g = myGetReadonlyKeys<myTodo>;

//6.
/**
 * 不使用 Omit 实现 TypeScript 的 Omit<T, K> 泛型。
 * Omit 会创建一个省略 K 中字段的 T 对象。
 * 例如：
 */

type myselfOmit<T, K extends keyof T> = {
  [P in keyof T as P extends K ? never : P]: T[P];
};
// 测试
interface wlfTodo {
  title: string;
  description: string;
  completed: boolean;
}

type wlfTodoPreview = myselfOmit<wlfTodo, "description" | "title">;

const wlftodo: wlfTodoPreview = {
  completed: false,
};

type mytestw = Omit<wlfTodo, "description" | "title">;

// 7.
/**
 *  不使用 Pick<T, K> ，实现 TS 内置的 Pick<T, K> 的功能。
 *  从类型 T 中选出符合 K 的属性，构造一个新的类型。
 */
type myselfPick<T, K extends keyof T> = {
  [key in K]: T[key];
};

// 测试
interface Todo2 {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview2 = myselfPick<Todo2, "title" | "completed">;

const todo2: TodoPreview2 = {
  title: "Clean room",
  completed: false,
};

//8.
/**
 * 不要使用内置的Readonly<T>，自己实现一个。
 * 泛型Readonly<T>会接收一个泛型参数，并返回一个完全相同的类型，只是所有属性都会是只读的。
 */
type myReadonly<T> = {
  readonly [key in keyof T]: T[key];
};
interface Todo3 {
  title: string;
  description: string;
}

type test4 = myReadonly<Todo3>;

// 9.
/**
 * 将一个元组类型转换为对象类型，这个对象类型的键/值和元组中的元素对应
 *  */
type TupleToObject<T extends readonly (keyof any)[]> = {
  [key in T[number]]: key;
};

const tuple = ["tesla", "model 3", "model X", "model Y"] as const;

type result = TupleToObject<typeof tuple>; // expected { tesla: 'tesla', 'model 3': 'model 3', 'model X': 'model X', 'model Y': 'model Y'}

//获取对象属性包含嵌套对象属性
const person = {
  name: "Alice",
  age: 25,
  address: {
    street: "123 Main St",
    city: "Anytown",
    country: "USA",
  },
};

type PersonType = typeof person;

/** 10.
 * 实现一个泛型MyReadonly2<T, K>，它带有两种类型的参数T和K。
 * 类型 K 指定 T 中要被设置为只读 (readonly) 的属性。如果未提供K，则应使所有属性都变为只读，就像普通的Readonly<T>一样。
 */
type myReadOnly2<T, K extends keyof T> = Omit<T, K> & Readonly<Pick<T, K>>;

interface Todo4 {
  title: string;
  description: string;
  completed: boolean;
}

type test6 = myReadOnly2<Todo4, "title" | "description">;

const todo: myReadOnly2<Todo4, "title" | "description"> = {
  title: "Hey",
  description: "foobar",
  completed: false,
};

// todo.title = "Hello"; // Error: cannot reassign a readonly property
// todo.description = "barFoo"; // Error: cannot reassign a readonly property
// todo.completed = true; // OK

// type test7 = MyReadonly2<Todo4, "title" | "description">;

// 11. 实现一个First<T>泛型，它接受一个数组T并返回它的第一个元素的类型。

type First<T extends (keyof any)[]> = T[0];

type arr1 = ["a", "b", "c"];
type arr2 = [3, 2, 1];

type head1 = First<arr1>; // 应推导出 'a'
type head2 = First<arr2>; // 应推导出 3

//12. 实现一个Last<T>泛型，它接受一个数组T并返回其最后一个元素的类型。
type last<T extends (keyof any)[]> = [any, ...T][T["length"]];
type arr3 = ["a", "b", "c"];
type arr4 = [3, 2, 1];

type head3 = last<arr3>; // 应推导出 'a'
type head4 = last<arr4>; // 应推导出 3

// 12.
/**
 * 实现一个泛型 DeepReadonly<T>，它将对象的每个参数及其子对象递归地设为只读。
 */

type DeepReadonly<T> = T extends never
  ? T
  : { readonly [key in keyof T]: DeepReadonly<T[key]> };

type X = {
  x: {
    a: 1;
    b: "hi";
    c: {
      d: {
        r: {
          g: {
            b: {
              a: 1;
            };
          };
        };
      };
    };
  };
  y: "hey";
};

type Todo = DeepReadonly<X>; // should be same as `Expected`

// 13
/**
 * 创建一个Length泛型，这个泛型接受一个只读的元组，返回这个元组的长度。
 */
type Length<T extends Readonly<Array<any>>> = T["length"];
type tesla = ["tesla", "model 3", "model X", "model Y"];
type teslaLength = Length<tesla>; // expected 4

// 14.
/**
 * 假如我们有一个 Promise 对象，这个 Promise 对象会返回一个类型。在 TS 中，我们用 Promise 中的 T 来描述这个 Promise 返回的类型。请你实现一个类型，可以获取这个类型。
 * 例如：Promise<ExampleType>，请你返回 ExampleType 类型。
 */

// type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U>
//   ? U extends PromiseLike<any>
//     ? MyAwaited<U>
//     : U
//   : never;

type MyAwaited<T extends PromiseLike<any>> = T extends PromiseLike<infer U>
  ? U extends PromiseLike<any>
    ? MyAwaited<U>
    : U
  : never;

type ExampleType = Promise<string>;

type Result = MyAwaited<ExampleType>; // string

//15
/**
 * 实现内置的 Exclude<T, U> 类型，但不能直接使用它本身。
 * 从联合类型 T 中排除 U 中的类型，来构造一个新的类型。
 */

// T中的值能否赋给U，如果可以直接排除，否则返回T
type MyExclude<T, U> = T extends U ? never : T;

type Result2 = MyExclude<"a" | "b" | "c", "a">; // 'b' | 'c'

// 16
/**
 * 实现一个 IF 类型，它接收一个条件类型 C ，一个判断为真时的返回类型 T ，以及一个判断为假时的返回类型 F。 C 只能是 true 或者 false， T 和 F 可以是任意类型。
 */

type If<C extends Boolean, T, F> = C extends true ? T : F;
type A = If<true, "a", "b">; // expected to be 'a'
type B = If<false, "a", "b">; // expected to be 'b'

//17
/**
 * 在类型系统里实现 JavaScript 内置的 Array.concat 方法，这个类型接受两个参数，返回的新数组类型应该按照输入参数从左到右的顺序合并为一个新的数组

 */
type Concat<T extends any[], U extends any[]> = [...T, ...U];

type Result3 = Concat<[1], [2]>; // expected to be [1, 2]

//18
/**
 * 在类型系统里实现 JavaScript 的 Array.includes 方法，这个类型接受两个参数，返回的类型要么是 true 要么是 false。
 */

type Includes<T extends readonly any[], U> = T extends [
  infer First,
  ...infer Last
]
  ? myEqual<U, First> extends true
    ? true
    : Includes<Last, U>
  : false;

type isPillarMen = Includes<["Kars", "Esidisi", "Wamuu", "Santana"], "Kars">; // expected to be `false`

// 19
/**
 * 在类型系统里实现通用的 Array.push 。
 *
 */

type Push<T extends any[], U> = [...T, U];

type Result4 = Push<[1, 2], "3">; // [1, 2, '3']

// 20
/**
 * 实现类型版本的 Array.unshift。
 */
type Unshift<T extends any[], U> = [U, ...T];
type Result5 = Unshift<[1, 2], 0>; // [0, 1, 2,]

// 21
/**
 * 实现类型版本的 Array.shift。
 */
type shift<T extends any[]> = T extends [infer First, ...infer Rest]
  ? Rest
  : never;

type Result6 = shift<[1, 2]>; // [0, 1, 2,]

// 22
/**
 * 实现类型版本的 Array.pop。
 */
type pop<T extends any[]> = T extends [...infer Rest, infer last]
  ? Rest
  : never;

type Result7 = pop<[1, 2]>; // [0, 1, 2,]

// 23
/**
 * 实现内置的 Parameters 类型，而不是直接使用它，可参考TypeScript官方文档。
 * 例如：
 */

type MyParameters<T extends (...agrs: any) => any> = T extends (
  ...args: infer S
) => any
  ? S
  : any;

const foo = (arg1: string, arg2: number): void => {};

type FunctionParamsType = MyParameters<typeof foo>; // [arg1: string, arg2: number]
