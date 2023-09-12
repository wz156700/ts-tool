# 透过 `new Array(n).fill(new Array(n).fill('.'))`和 `new Array(n).fill(0).map(\_ => new Array(n).fill('.'))`两句代码，探索 js 中 fill 方法

## 前言：

最近在做算法题时，遇到需要创建二维数组并进行初始化的情况，刚开始我使用的是 `new Array(n).fill(new Array(n).fill('.')) `进行二维数组的初始化，但无论怎样我都通不过测试用例。这让我十分纳闷，无奈之下，只能对照着标准代码一句一句排查，终于让我找到了罪魁祸首：`Array(n).fill(new Array(n).fill('.'))`。

麻了.jpg

接下来，我们便通过这两句代码来将 js 中的 fill（）方法重学一下，避免下次再出现类似的问题。

## 两句代码之间的区别

**相同点**
以上两句代码目的都是创建一个` n x n 的二维数组`，但是它们的方式和结果是不同的。

**不同点**

1. `let board = new Array(n).fill(new Array(n).fill('.'));`

   这段代码在填充数组时，使用了同一个`数组实例（通过 new Array(n).fill('.')创建）`。这会**创建一个数组，其中每个元素都指向同一个数组**（也就是说，如果你修改其中一个数组，所有数组都会被修改）。这是因为在 JavaScript 中，对象（包括数组）是通过`引用`传递的。

2. `const board2: string[][] = new Array(n).fill(0).map(\_ => new Array(n).fill('.'));`

这段代码**通过.map()函数创建了 n 个新的数组实例**。这意味着每个子数组都是独立的，修改其中一个并不会影响其他的。这是因为.map()函数会对数组的每个元素执行回调函数，而回调函数中又创建了一个新的数组。

因此，尽管这两段代码看起来都创建了 n x n 的二维数组，但是他们在数组的引用和修改上有很大的不同。

**为什么会造成这样的结果呢？**

首先 我们先来自己大概实现下 `fill` 方法：

```
Array.prototype.fill = function(value, start = 0, end = this.length) {
  // Handle negative values for start
  if (start < 0) {
    start += this.length;
    if (start < 0) start = 0;
  }

  // Handle negative values for end
  if (end < 0) {
    end += this.length;
  }

  // Ensure start is not greater than end
  if (start > end) {
    [start, end] = [end, start];
  }

  // Fill the array
  for (let i = start; i < end; i++) {
    this[i] = value;
  }

  return this;
};

```

**可以看到 fill 方法中是直接将 value 的值给每一项，并且会改变原数组的值。**

注意: 这个实现并没有处理一些边缘情况和错误检查，所以它并不是一个完全准确的实现。真实的 Array.prototype.fill() 方法会更加复杂，因为它需要处理各种边缘情况和错误条件。

因此当我们传入一个引用类型时，数组中每一项都是对同一个对象的引用。这意味着如果你修改了一个元素，所有的元素都会受到影响。这个特性在使用 .fill() 方法填充数组时需要特别注意。

## fill 方法其他需要注意的地方：

### 语法：

`arr.fill(value ，[start]，[end])`
参数：

1. value：用来填充数组的值。
2. start （可选）：开始填充数组的索引。默认为 0。
3. end （可选）：停止填充数组的索引。默认为 arr.length。
4. 返回值：被修改的数组，从 start 到 end 被 value 填充。

### 原地操作

`fill()` 是一个原地操作，这意味着它会`直接修改原始数组`，而不是创建一个新的数组。这与 JavaScript 中的许多其他数组方法（如 `map() `或 `filter()`）不同，**后者会返回新数组并保持原始数组不变**。

### 负索引

`fill()` 方法也接受`负索引`，它们从数组的末尾开始计算。例如，**-1 指的是最后一个元素，-2 指的是倒数第二个元素**，等等。如果**你对 start 或 end 参数使用负索引，fill() 将从`数组末尾`开始或停止填充**。

### 兼容性：

`所有现代浏览器中都受支持，但在 Internet Explorer 中不受支持。`如果你需要支持旧版浏览器，你可能需要使用`polyfill` 或者其他方式来实现相同的功能。

## 总结：

通过这两句代码，让我获益匪浅。虽然花了点时间去排查问题，但结果我还是很开心的。今天的分享就到此为止了，如有错误之处，欢迎大家留言指出，谢谢大家了。
