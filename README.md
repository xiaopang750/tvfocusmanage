## 怎么使用

```
import tvfocusmanage from 'tvfocusmanage';

let {FocusManage, Focus, focusManageLib} = tvfocusmanage;

第一步:
<FocusManage>
  <App />
</FocusManage>

FocusManage类似一个provider 提供focusManageLib这个对象来
管理所有子焦点组件的状态

第二步:
如果你希望哪个组件或者element能够有焦点就包一层 Focus组件

<Focus>
  <SomeComponent />
</Focus>

<Focus>
  <div>222</div>
</Focus>

Focus组件是通过cloneElement实现的它要做的有几件事情
1. 当组件mount的时候计算他子组件的位置信息
2. 跟子组件生成一个唯一id
3. 把{id: 位置信息} 存储到 focusManageLib上
4. unmount 时删除 {id: 位置信息}
5. 当focusManageLib 触发相应的状态时 比如onOk点击 onEdge到边缘 传递相应的props状态给子组件

为了遵循react 数据驱动的原则 SomeComponent 的结构如下:
const SomeComponent = ({focusActive, onOk, onEdge}) => {
  // focusActive 为当前组件获取焦点时的样式名称
  if (onOk) {
    alert('当前组件被点击了');
    alert(onOk.element);
  }
  if (onEdge) {
    alert('已经到边界条件了， 再按方向键还是当前组件');
    alert(onEdge.element); // 当前组件
    alert(onEdge.dir); // 当前方向
  }
  return (
    <div className={focusActive}>hello world</div>
  )
}

当然为了避免和父级传来的props冲突,这些接收的props名称可以自己定义:
<Focus
  recivePropsName="foo"
  activeClassName="bar"
  recivePropsOkName="haha"
  recivePropsEdgeName="hehe"
>
  <SomeComponent />
</Focus>

有了捕获事件的功能后，当然还不完善，如果你想从当前元素到指定元素你可以这样做

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

foGoto 四个值分别代表当按 上,右,下,左 四个方向时 到那个元素
现在指向的是0 那么就到 foIndex 为 0 的元素
如果你只想左方向到 0 你可以这么写 -1;-1;-1;0 其他情况同理
```
##  工作原理
```
就像使用redux一样

焦点组件的context对象如下:

const defaultFunc = {
  active() {},
  unactive() {},
  onEdge() {},
  ok() {},
  unok() {},
  clearOnEdge() {}
};

const focusManage = {
  cur: {
    ...defaultFunc
  },
  last: {
    ...defaultFunc
  },
  cubs: {},
  foIndexs: {}
};

当每个Focus组件 mount 之后 我们为它生成一个唯一id

id 对应一个 具有 他子组件 位置信息的对象

let cubInfo = {
  rect,
  element,
  goto,
  active: () => {
    this.setState({[recivePropsName]: activeClassName});
  },
  unactive: () => {
    this.setState({[recivePropsName]: ''});
  },
  ok: () => {
    this.setState({[recivePropsOkName]: {
      element
    }});
  },
  unok: () => {
    this.setState({[recivePropsOkName]: null});
  },
  onEdge: (dir) => {
    this.setState({[recivePropsEdgeName]: {
      dir,
      element
    }});
  },
  clearOnEdge: () => {
    this.setState({[recivePropsEdgeName]: null});
  }
};

然后把这个对象挂载在 FocusManage 定义的context属性上

this.context.focusInfo.cubs[id] = cubInfo;

cubs 是一个对象 里面存了 很多 Focus组件的信息 因为是hash解构 所以存取都比较快

我们使用每个Focus组件的位置信息

根据 阴影算法 和 区域面积算法 算出哪个元素应该被聚焦

然后调用被聚焦对象的cubInfo上的active方法

调用其他方法跟调用active方法同理

```
##  优点
```
1. 基本不需要使用或者记住任何API。
2. 组件mount的同时生成位置信息存储到内存中，所以所有的算法都是基于内存的计算，不需要每次都获取dom。
3. 遵循react的数据流驱动原则，没有破坏子组件或者父组件的结构。
```
## TODO
```
1. 增加电视端常用的scroll组件
2. 添加update方法更新内存中的位置信息
3. 添加具体例子
4. 添加最佳实践的说明
```
