import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import {getWidgetRect} from '../lib/core';

const careteId = () => {
  return Math.random() * 100000000000000000 + new Date().getTime();
};

const changeGoto = (foGoto) => {
  let result = {};
  if (foGoto) {
    let gotos = foGoto.split(';');
    let indexMap = {
      0: 'up',
      1: 'right',
      2: 'down',
      3: 'left'
    };
    gotos.forEach((goto, index) => {
      let dir = indexMap[index];
      result[dir] = goto;
    });
  }
  return result;
};

class Focus extends Component {
  componentDidMount() {
    let {foIndex, foGoto} = this.props;
    let goto = changeGoto(foGoto);
    let element = ReactDOM.findDOMNode(this);
    let id = careteId();
    this.id = id;
    this.foIndex = foIndex;
    let rect = getWidgetRect(element);
    let {
      recivePropsName = 'focusActive',
      activeClassName = 'focusActive',
      recivePropsOkName = 'onOk',
      recivePropsEdgeName = 'onEdge'
    } = this.props;
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
    this.context.focusInfo.cubs[id] = cubInfo;
    if (foIndex) this.context.focusInfo.foIndexs[foIndex] = cubInfo;
    element.dataset.focusId = id;
  }
  componentWillUnmountMount() {
    delete this.context.focusInfo.cubs[this.id];
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
