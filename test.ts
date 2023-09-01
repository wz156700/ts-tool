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

//2. 获取数组元素类型
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
