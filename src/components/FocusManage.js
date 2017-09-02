import React, {Component} from 'react';
import {focusManageLib} from '../lib/core';

const createFocusManage = (keyName = 'focusInfo') => {
  class FocusManage extends Component {
    constructor(props) {
      super(props);
      this.focusInfo = focusManageLib;
    }
    getChildContext() {
      return {[keyName]: this.focusInfo};
    }
    render() {
      return this.props.children;
    }
  }
  FocusManage.childContextTypes = {
    focusInfo: React.PropTypes.object.isRequired
  };
  return FocusManage;
};

export default createFocusManage();
