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
