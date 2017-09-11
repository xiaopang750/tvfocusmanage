import React, {Component} from 'react';
import {focusManageLib, careteId, getWidgetRect, refreshLocInfo} from '../lib/core';

const outerStyle = {
  boxSizing: 'border-box',
  overflow: 'hidden',
  height: '100%'
};

const innerStyle = {
  boxSizing: 'border-box',
  position: 'relative'
};

class FocusScroll extends Component {
  constructor(props) {
    super(props);
    this.dixX = 0;
    this.disY = 0;
  }
  componentDidMount() {
    let id = careteId();
    let oWrapInfo = getWidgetRect(this.oWrap);
    this.oWrapTop = oWrapInfo.top;
    this.oWrapLeft = oWrapInfo.left;
    this.oWrapHeight = oWrapInfo.height;
    this.oWrap.dataset.focusScrollId = id;
    focusManageLib.widgets[id] = this;
    this.dir = this.oWrap.dataset.dir;
  }
  action(e) {
    let aChilds = this.oInner.querySelectorAll('[data-focus-id]');
    let nowTarget = e.element;
    let oWrapHeight = this.oWrap.offsetHeight;
    let oWrapWidth = this.oWrap.offsetWidth;
    let centerWrapHeight = oWrapHeight / 2;
    let centerWrapWidth = oWrapWidth / 2;
    let nowFocusTop = nowTarget.offsetTop;
    let nowFocusLeft = nowTarget.offsetLeft;
    let marginTop = parseInt(getComputedStyle(nowTarget, null).marginTop, 10);
    let marginBottom = parseInt(getComputedStyle(nowTarget, null).marginBottom, 10);
    let marginLeft = parseInt(getComputedStyle(nowTarget, null).marginLeft, 10);
    let marginRight = parseInt(getComputedStyle(nowTarget, null).marginRight, 10);
    let expectedLocTop = centerWrapHeight - nowFocusTop - marginTop - marginBottom;
    let expectedLocLeft = centerWrapWidth - nowFocusLeft - marginLeft - marginRight;
    let maxTop = this.oInner.scrollHeight;
    let maxLeft = this.oInner.scrollWidth;
    if (expectedLocTop < 0) {
      if (oWrapHeight - expectedLocTop >= maxTop) {
        this.disY = oWrapHeight - maxTop;
      } else {
        this.disY = expectedLocTop;
      }
    } else {
      this.disY = 0;
    }
    if (expectedLocLeft < 0) {
      if (oWrapWidth - expectedLocLeft >= maxLeft) {
        this.disX = oWrapWidth - maxLeft;
      } else {
        this.disX = expectedLocLeft;
      }
    } else {
      this.disX = 0;
    }
    if (this.dir === 'h') {
      this.disY = 0;
    } else if (this.dir === 'v') {
      this.disX = 0;
    }
    this.oInner.style.transform = `translate(${this.disX}px, ${this.disY}px)`;
    refreshLocInfo(aChilds);
  }
  render() {
    let outerProps = {...this.props, ...this.state};
    outerProps.ref = (oWrap) => {
      this.oWrap = oWrap;
    };
    outerProps.style = {...outerStyle, ...this.props.style};
    let innerProps = {...this.props.children.props, ...this.props.children.state};
    innerProps.style = {...innerStyle, ...this.props.children.props.style};
    innerProps.ref = (oInner) => {
      this.oInner = oInner;
    };
    return (
      <div {...outerProps}>
        {React.cloneElement(React.Children.only(this.props.children), innerProps)}
      </div>
    );
  }
}

export default FocusScroll;
