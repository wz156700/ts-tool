// 自定义 ReturnType
type MyReturnType<T extends Function> = T extends (...arg: any) => infer R
  ? R
  : never;

const fn = (v: boolean) => {
  if (v) return 1;
  else return 2;
};

type a = MyReturnType<typeof fn>; // 应推导出 "1 | 2"

// 自定义 Omit
type MyOmit<T, U> = {
  [key in keyof T as key extends U ? never : key]: T[key];
};

interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = MyOmit<Todo, "description" | "title">;

const todo: TodoPreview = {
  completed: false,
};

// 对象部分属性只读
type MyReadonly2<T, K extends keyof T = keyof T> = Readonly<Pick<T, K>> &
  Omit<T, K>;

interface Todo2 {
  title: string;
  description: string;
  completed: boolean;
}
const todo2: MyReadonly2<Todo2, "title" | "description"> = {
  title: "Hey",
  description: "foobar",
  completed: false,
};
todo2.title = "Hello"; // Error: cannot reassign a readonly property
todo2.description = "barFoo"; // Error: cannot reassign a readonly property
todo2.completed = true; // OK

//对象属性只读（递归）
type DeepReadonly<T> = keyof T extends never
  ? T
  : {
      readonly [key in keyof T]: DeepReadonly<T[key]>;
    };

type X = {
  x: {
    a: 1;
    b: "hi";
    c: { d: { m: "yes" } };
  };
  y: "hey";
};
type Todo3 = DeepReadonly<X>; // should be same as Expected

// 元组转合集
type TupleToUnion<T> = T extends Array<infer U> ? U : never;
type Arr = ["1", "2", "3"];

type Test = TupleToUnion<Arr>;
