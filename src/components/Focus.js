import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getWidgetRect, careteId, changeGoto} from '../lib/core';

class Focus extends Component {
  componentDidMount() {
    let {
      recivePropsName = 'focusActive',
      activeClassName = 'focusActive',
      onOk = () => {},
      onAcitve = () => {},
      onLeave = () => {},
      onEdge = () => {},
      onBeforeLeave = () => {},
      foIndex,
      zIndex = 1,
      foGoto
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
        this.setState({[recivePropsName]: ''});
      },
      onOk,
      onEdge,
      onAcitve,
      onBeforeLeave,
      onLeave
    };
    this.context.focusInfo.cubs[zIndex] = this.context.focusInfo.cubs[zIndex] || {};
    this.context.focusInfo.cubs[zIndex][id] = cubInfo;
    if (foIndex) this.context.focusInfo.foIndexs[foIndex] = cubInfo;
    element.dataset.focusId = id;
  }
  componentWillUnmount() {
    delete this.context.focusInfo.cubs[this.zIndex][this.id];
    if (this.foIndex) {
      delete this.context.focusInfo.foIndexs[this.foIndex];
    }
  }
  render() {
    let props = {
      ...this.props,
      ...this.state
    };
    return React.cloneElement(React.Children.only(this.props.children), props);
  }
}

Focus.contextTypes = {
  focusInfo: React.PropTypes.object.isRequired
};

export default Focus;
