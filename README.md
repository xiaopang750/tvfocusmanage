tvfocusmanage
==============

# 说明


一个tv端的 react 焦点框架

先看两个例子

[normal组件](http://119.254.101.32:7788/index.html)

[scroll组件](http://119.254.101.32:7788/index2.html)

用键盘方向键和回车键操作

第一个是tv端常用的业务逻辑左侧是菜单，右侧是展示列表。

第二个也是tv端常用的滚动组件。


# 开始

1. git clone https://github.com/xiaopang750/tvfocusmanage.git
2. cd tvfocusmanage
3. npm install -d
4. npm run dev
5. open the browser look at http://localhost:9000/ and http://localhost:9000/index2.html


# 怎么使用


## 第一步：

```
import {FocusManage, Focus, focusManageLib} from 'tvfocusmanage';

<FocusManage>
  <App />
</FocusManage>

```

FocusManage类似一个provider 提供focusManageLib这个对象来
管理所有子焦点组件的状态


## 第二步:


如果你希望哪个组件或者element能够获取焦点就包一层 Focus组件


```
<Focus>
  <SomeComponent />
</Focus>

<Focus>
  <div>222</div>
</Focus>
```

## Focus组件是通过cloneElement实现的,它要做的有几件事情:

1. 当组件mount的时候计算他子组件的位置信息
2. 跟子组件生成一个唯一id
3. 把{id: 位置信息} 存储到 focusManageLib上
4. unmount 时删除 {id: 位置信息}

## 为了遵循react 数据驱动的原则 SomeComponent 的结构如下:


```
const SomeComponent = ({focusActive}) => {
  // focusActive 为当前组件获取焦点时的样式名称
  return (
    <div className={`item ${focusActive}`}>hello world</div>
  )
}

Focus的子元素也可以是普通div 例如:
<Focus>
  <div className="foo">222</div>
</Focus>

当div被focus的时候className 会变成 "foo focusActive"

所有的focus元素不会额外的包裹任何元素

<Focus>
  <div className="foo">222</div>
</Focus>

最后渲染表现为:
<div className="foo">222</div>
```

这里的 focusActive 是 FocusMange通过setSate传过来的props

这里不用担心性能问题，因为只触发了当前组件和前一个组件的setState

## 当然为了避免和父级传来的props冲突,这些接收的props名称可以自己定义:

recivePropsName 为接收props的键名

activeClassName 为对应的键名

```
<Focus
  recivePropsName="foo"
  activeClassName="bar"
>
  <SomeComponent />
</Focus>

const SomeComponent = ({foo}) => {
  // 那么当foo的值就是 bar 样式表里面做对应的处理就行了
  return (
    <div className={`item ${foo}`}>hello world</div>
  )
}
```

## 当前组件获取焦点并通过样式来反馈是不够的

我们还需要一些回调事件来支撑一些业务逻辑

比如当前组件被点击、被聚焦、失去焦点等


```

<Focus key={name}
  onOk={...被点击}
  onLeave={...失去焦点}
  onBeforeLeave={...将要失去焦点}
  onAcitve={...聚焦}
  onEdge={...到了边缘}
>
  <SomeComponent type={type} name={name} />
</Focus>

```

暂时只提供了5个回调事件，基本能满足大多数的业务需求


## 如果你需要一个元素按某个方向键总是固定移动到某个元素那么你可以这样做

```
<div>
  <div>
    <Focus foIndex="0">
      <div/>
    </Focus>
    <Focus>
      <div/>
    </Focus>
  </div>
  <div>
    <Focus foGoto="0;0;0;0">
      <div/>
    </Focus>
    <Focus>
      <div/>
    </Focus>
  </div>
</div>
```

foGoto 四个值分别代表当按 上,右,下,左 四个方向时 到那个元素

现在指向的是0 那么就到 foIndex 为 0 的元素

如果你只想左方向到 0 你可以这么写 -1;-1;-1;0 其他情况同理

## 关于弹出层的问题

tv端二级导航或者多级导航还比较常见

可能会出现弹出层的在一堆Focus元素之间

此时通过算法计算出一下个被聚焦的元素可能并不是我们想要的结果

所以这个时候可以引入层级的概念

所有Focus组件默认的zIndex为1

```
<Focus
  zIndex="2"
>
  <div />
</Focus>
```

FocusManage 提供一个 zIndexChange的方法

比如当前获得焦点的元素按右键 需要聚焦到一个弹框组件

弹框组件的层级zIndex 为2 当移动到弹框里面 因为只有弹框

里面的焦点元素为 2 我们把它们都视为同级焦点元素

所以在第一层级的 焦点元素都不能被聚焦

[例子](http://119.254.101.32:7788/index.html)


## 关于scroll组件

tv 端经常需要在指定区可视区域内滚动

这个焦点库提供了一个简单的封装

纵向滚动不需要计算实际高度,因为元素没有float, 组件可以自动计算出实际高度

横向滚动需要自己计算实际宽度,因为元素可能float了,宽度需要预先靠开发者

设定才不会导致元素被挤下去,组件才能自动计算实际宽度。

```
<FocusScroll
  data-dir="v"
>
  <div className="scroll-nav-v">
    <Focus>
      <div>1</div>
    </Focus>
    <Focus>
      <div>2</div>
    </Focus>
    <Focus>
      <div>3</div>
    </Focus>
  </div>
</FocusScroll>

只需要在原来基础上套一层 FocusScroll组件 表示被包裹的元素需要在可视区内滚动

.scroll-nav-v {
  height: 300px;
}

不需要加其他样式 比如: overflow:hidden

如果是横向:
<FocusScroll
  data-dir="h"
>
  <div className="scroll-nav-h">
    <Focus>
      <div>1</div>
    </Focus>
    <Focus>
      <div>2</div>
    </Focus>
    <Focus>
      <div>3</div>
    </Focus>
  </div>
</FocusScroll>

只需要改一下 data-dir的方向即可

.scroll-nav-h 的实际宽度一般情况下需要js来计算
```

[例子](http://119.254.101.32:7788/index2.html)


# 工作原理

## 焦点组件Provider的focusManageLib对象如下:

```
const defaultFunc = {
  active() {},
  unactive() {},
  onBeforeLeave() {}
};

const focusManageLib = {
  cur: {
    ...defaultFunc
  },
  last: {
    ...defaultFunc
  },
  cubs: {},
  foIndexs: {},
  zIndex: 1
};

```

## 当每个Focus组件 mount 之后 我们为它生成一个唯一id

id 对应一个 具有 他子组件 位置信息的对象

```
let cubInfo = {
  rect,
  element,
  goto,
  zIndex: parseInt(zIndex, 10),
  active: () => {
    this.setState({[recivePropsName]: activeClassName});
  },
  unactive: () => {
    this.setState({[recivePropsName]: ''});
  },
  onOk,
  onEdge,
  onAcitve,
  onBeforeLeave,
  onLeave
};
```

然后把这个对象挂载在 FocusManage 定义的context属性上

```
this.context.focusInfo.cubs[zIndex][id] = cubInfo;
```

cubs 是一个对象 里面存了 很多 Focus组件的信息 因为是hash解构 所以存取都比较快

我们使用每个Focus组件的位置信息

根据 阴影算法 和 区域面积算法 算出哪个元素应该被聚焦

然后调用被聚焦对象的cubInfo上的active方法去触发setState

调用其他方法跟调用active方法同理

# inspired by
[阿里webos开发文档](http://developer.tv.yunos.com/example/demo/ui-example.html#开发演示-0)

阿里写的焦点框架不是基于react的，需要理解记忆的api较多，这里只是抽取了计算被focus元素的两个算法平面区域算法

和阴影算法。

[阿里tv端实践](http://www.imooc.com/learn/590)

其中的第六章: 第6章 TV前端开发解决方案——by 听鸿

主要讲了上面提到的算法的简单实现原理。

#  优点

1. API LESS。
2. 组件mount的同时生成位置信息存储到内存中，所以所有的算法都是基于内存的计算，不需要每次都获取dom。
3. 遵循react的数据流驱动原则，没有破坏子组件或者父组件的结构。


# TODO

1. 添加update方法更新内存中的位置信息
2. 添加最佳实践的说明
3. 解决scroll组件动态加载数据的bug
4. Focus组件去除ReactDOM.findDOMNode方法
