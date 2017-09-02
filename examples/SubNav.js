import React, {Component} from 'react';
import {Focus, focusManageLib} from '../src';
import Cube from './Cube';

const {zIndexChange} = focusManageLib;
const data = [
  {type: 'subnav', name: '6'},
  {type: 'subnav', name: '7'},
  {type: 'subnav', name: '8'},
  {type: 'subnav', name: '9'},
  {type: 'subnav', name: '10'}
];

class SubNav extends Component {
  constructor(props) {
    super(props);
    this.onLeave = this.onLeave.bind(this);
    this.onBeforeLeave = this.onBeforeLeave.bind(this);
  }
  onLeave(e) {
    if (e.eventType === 'right') {
      let {showOrHideSubNav = () => {}} = this.props;
      showOrHideSubNav();
    }
  }
  onBeforeLeave(e) {
    if ((e.eventType === 'left' || e.eventType === 'right') && this.props.show === true) {
      zIndexChange('down');
    }
  }
  render() {
    let {show} = this.props;
    return (
      <div>
        {show ? (
          <div className="sub-nav-wrap">
            {
              data.map(({type, name}, index) => {
                return (
                  <Focus
                    key={name}
                    zIndex="2"
                    onLeave={this.onLeave}
                    onBeforeLeave={this.onBeforeLeave}
                  >
                    <Cube type={type} name={name} />
                  </Focus>
                )
              })
            }
          </div>
        ) : ''}
      </div>
    );
  }
}

export default SubNav;
