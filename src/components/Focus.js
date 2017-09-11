import React, {Component} from 'react';
import classnames from 'classnames';
import ReactDOM from 'react-dom';
import {getWidgetRect, careteId, changeGoto} from '../lib/core';

class Focus extends Component {
  constructor(props) {
    super(props);
    this.recivePropsName = 'focusActive';
    this.cachePropsName = 'cached';
    this.activeClassName = 'focusActive';
  }
  componentDidMount() {
    let {
      recivePropsName = this.recivePropsName,
      activeClassName = this.activeClassName,
      cachePropsName = this.cachePropsName,
      onOk = () => {},
      onAcitve = () => {},
      onLeave = () => {},
      onEdge = () => {},
      onBeforeLeave = () => {},
      foIndex,
      zIndex = 1,
      foGoto,
      foWidgetBind = ''
    } = this.props;
    let goto = changeGoto(foGoto);
    let element = ReactDOM.findDOMNode(this);
    let id = careteId();
    this.id = id;
    this.foIndex = foIndex;
    this.zIndex = zIndex;
    let rect = getWidgetRect(element);
    let cubInfo = {
      rect,
      element,
      goto,
      zIndex: parseInt(zIndex, 10),
      active: () => {
        this.setState({[recivePropsName]: activeClassName});
      },
      unactive: () => {
        this.setState({[recivePropsName]: cachePropsName});
      },
      clear: () => {
        this.setState({[recivePropsName]: ''});
      },
      onOk,
      onEdge,
      onAcitve,
      onBeforeLeave,
      onLeave,
      foWidgetBind
    };
    this.context.focusInfo.cubs[zIndex] = this.context.focusInfo.cubs[zIndex] || {};
    this.context.focusInfo.cubs[zIndex][id] = cubInfo;
    if (foIndex) this.context.focusInfo.foIndexs[foIndex] = cubInfo;
    element.dataset.focusId = id;
    element.dataset.focusIndex = zIndex;
  }
  componentWillUnmount() {
    delete this.context.focusInfo.cubs[this.zIndex][this.id];
    if (this.foIndex) {
      delete this.context.focusInfo.foIndexs[this.foIndex];
    }
  }
  render() {
    let props = {
      ...this.state
    };
    let child = this.props.children;
    let {type} = child;
    let {recivePropsName = this.recivePropsName, cachePropsName = this.cachePropsName} = this.props;
    let childClass = child.props.className;
    if (typeof type !== 'function') {
      let focusClass = classnames({
        [childClass]: childClass,
        [recivePropsName]: this.activeClassName === props[recivePropsName],
        [cachePropsName]: this.cachePropsName === props[recivePropsName]
      });
      props.className = focusClass;
      delete props[recivePropsName];
    }
    return React.cloneElement(React.Children.only(child), props);
  }
}

Focus.contextTypes = {
  focusInfo: React.PropTypes.object.isRequired
};

export default Focus;
