import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getWidgetRect} from '../lib/core';

const careteId = () => {
  return Math.random() * 100000000000000000 + new Date().getTime();
};

class Focus extends Component {
  componentDidMount() {
    let element = ReactDOM.findDOMNode(this);
    let id = careteId();
    this.id = id;
    let rect = getWidgetRect(element);
    let {recivePropsName = 'focusActive', activeClassName = 'focusActive'} = this.props;
    this.context.focusInfo.cubs[id] = {
      rect,
      element,
      active: () => {
        this.setState({[recivePropsName]: activeClassName});
      },
      unactive: () => {
        this.setState({[recivePropsName]: ''});
      }
    };
    element.dataset.focusId = id;
  }
  componentWillUnmountMount() {
    delete this.context.focusInfo.cubs[this.id];
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
