---
title: TypeScript
author: 烈风裘
date: 2017-08-07T08:37:05.000Z
draft: false
comments: true
star: false
cover: ''
tags: 
  - TypeScript
---

> 代码详解 + 备忘记录

## 基础类型

```js
// 布尔
let isDone: boolean = false;
// 数字
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
// 字符串
let name: string = "bob";
// 数组
let list: number[] = [1, 2, 3];
let list: Array<number> = [1, 2, 3]; // 数组泛型，Array<元素类型>
let list: (string | number)[] = ['name']
let list: any[] = ['name']
// 对象
let obj: {} = {foo:'foo'};
// 元组类型, 限定了值的pattern: 两个元素, 第一个是string, 第二个是number
let x: [string, number];
// 多类型
let x: string | number;
// 枚举
enum Color {Red = 1, Green, Blue}
let cRed: Color = Color.Red; // 1
let colorName: string = Color[2]; // Green
// Any
let notSure: any = 4;
// Void 表示没有任何类型, 多用于函数返回
function warnUser(): void {
    alert("This is my warning message");
}
// Null 和 Undefined, 常用在联合类型, 一般不建议使用
let u: undefined = undefined;
let n: null = null;
// Never, 表示的是那些永不存在的值的类型
function error(message: string): never {
    // 返回never的函数必须存在无法达到的终点
    throw new Error(message);
}
// 类型断言
- “尖括号”语法
let someValue: any = "this is a string";
let strLength: number = (<string>someValue).length;
- as语法
let someValue: any = "this is a string";
let strLength: number = (someValue as string).length;

// 解构模式标记类型
let {a, b}: {a: string, b: number} = o;
```

## 变量声明

- 尽量使用`let`, 'const'替换`var`
- 解构和 es6 相同, 注意: `默认值 + 类型 + 解构` 的组合写法

## 接口

> TypeScript 的核心原则之一是对值所具有的结构进行类型检查。

```js
// 可选属性
interface SquareConfig {
  color?: string;
  width?: number;
}
// 只读属性
interface Point {
    readonly x: number;
    readonly y: number;
}
// 额外的属性
interface SquareConfig {
    color?: string;
    width?: number;
    [propName: string]: any;
}
// 函数类型, 定义调用签名, 只做类型检查(不是函数名)
interface SearchFunc {
  (source: string, subString: string): boolean;
}
// 可索引的类型
interface StringArray {
  [index: number]: string;
}
// 类类型
interface ClockInterface {
    currentTime: Date;
    new (hour: number, minute: number);
    setTime(d: Date);
}

class Clock implements ClockInterface {
    currentTime: Date;
    constructor(h: number, m: number) { }
    setTime(d: Date) {
        this.currentTime = d;
    }
}
// 继承接口
interface Shape {
    color: string;
}
interface Square {
    sideLength: number;
}
interface Foo extends Square, Shape {
    FooLength: number;
}
// 接口集成类(未写)
```

## 类

```js
// 类
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
// 继承
class Animal {
    name:string;
    constructor(theName: string) { this.name = theName; }
    move(distanceInMeters: number = 0) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}

class Snake extends Animal {
    constructor(name: string) { super(name); }
    move(distanceInMeters = 5) {
        console.log("Slithering...");
        super.move(distanceInMeters);
    }
}
// 公共，私有与受保护的修饰符
// 默认public
// private 只在'当前类'的内部访问
class Animal {
    private name: string;
    constructor(theName: string) { this.name = theName; }
}
// protected 只在'当前类及其子类'的内部访问
// 如果构造函数也可以被标记成protected, 意味着这个类不能实例化, 只能由子类实例化
class Person {
    protected name: string;
    constructor(name: string) { this.name = name; }
}
// readonly修饰符 只读, 只能在构造函数中被初始化
class Octopus {
    readonly name: string;
    readonly numberOfLegs: number = 8;
    constructor (theName: string) {
        this.name = theName;
    }
}
// 存取器(拦截器)
class Employee {
    private _fullName: string;

    get fullName(): string {
        return this._fullName;
    }

    set fullName(newName: string) {
        if (passcode && passcode == "secret passcode") {
            this._fullName = newName;
        }
        else {
            console.log("Error: Unauthorized update of employee!");
        }
    }
}
// 静态属性: 这些属性存在于类本身上面而不是类的实例上, 通过Grid.访问
class Grid {
    static origin = {x: 0, y: 0};
    calculateDistanceFromOrigin(point: {x: number; y: number;}) {
        let xDist = (point.x - Grid.origin.x);
        let yDist = (point.y - Grid.origin.y);
        return Math.sqrt(xDist * xDist + yDist * yDist) / this.scale;
    }
    constructor (public scale: number) { }
}

let grid1 = new Grid(1.0);  // 1x scale
let grid2 = new Grid(5.0);  // 5x scale

console.log(grid1.calculateDistanceFromOrigin({x: 10, y: 10}));
console.log(grid2.calculateDistanceFromOrigin({x: 10, y: 10}));

// 抽象类
// 构造函数
// 把类当做接口使用
```

## 函数

```js
// 函数类型
function add(x: number, y: number): number {
    return x + y;
}
// 可选参数和默认参数
function buildName(firstName: string, lastName?: string) {
    // ...
}
function buildName(firstName: string, lastName = "Smith") {
    // ...
}
// 剩余参数
function buildName(firstName: string, ...restOfName: string[]) {
  return firstName + " " + restOfName.join(" ");
}
// this参数
// noImplicitThis标记: 提供指定类型的this假参数
// this参数在回调函数里: 将this类型设置为void避免函数内部使用this

// 重载
function pickCard(x: {suit: string; card: number; }[]): number;
function pickCard(x: number): {suit: string; card: number; };
function pickCard(x): any {
    // Check to see if we're working with an object/array
    // if so, they gave us the deck and we'll pick the card
    if (typeof x == "object") {
        let pickedCard = Math.floor(Math.random() * x.length);
        return pickedCard;
    }
    // Otherwise just let them pick the card
    else if (typeof x == "number") {
        let pickedSuit = Math.floor(x / 13);
        return { suit: suits[pickedSuit], card: x % 13 };
    }
}
```

## 泛型

```js
// 定义类型变量T
function identity<T>(arg: T): T {
  return arg;
}
```
