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
