## how to use

```
import tvfocusmanage from 'tvfocusmanage';

let {FocusManage, Focus, focusManageLib} = tvfocusmanage;

step1:
<FocusManage>
  <App />
</FocusManage>

step2:
when where you want to a element can be focus
you could do like this

<Focus>
  <SomeComponent />
</Focus>

const SomeComponent = (props) => {
  let activeClass = props.focusActive;
  return (
    <div className={activeClass}>hello world</div>
  )
}

the default props name is focusActive;
this default props activeClassName value is focusActive;
you can also config byyourself just like this:

<Focus recivePropsName="foo" activeClassName="bar">
  <SomeComponent />
</Focus>

and then in SomeComponent
you should do like this;
let activeClass = props.foo;
and in your stylesheet you will process the bar className
```
##  how to work
```
就想使用redux一样

焦点组件的context对象如下:

const focusManageLib = {
  last: {
    unactive() {}
  },
  cur: {},
  cubs: {}
};

当每个Focus组件 mount 之后 我们为它生成一个唯一id

id 对应一个 具有 他子组件 位置信息的对象

let info = {
      rect,
      element,
      active: () => {
        this.setState({[recivePropsName]: activeClassName});
      },
      unactive: () => {
        this.setState({[recivePropsName]: ''});
}

然后把这个对象挂载在 FocusManage 定义的context属性上

this.context.focusInfo.cubs[id] = info;

cubs 是一个数组 里面存了 很多 Focus组件的信息

我们使用每个Focus组件的位置信息

根据 阴影算法 和 区域面积算法 算出哪个元素应该被聚焦

然后调用active 方法

并且调用上一个被聚焦元素的 unactive方法

```
