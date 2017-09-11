import React, {Component} from 'react';
import {Focus, focusManageLib} from '../../src';
import Cube from '../Cube';
import SubNav from './SubNav';

const {zIndexChange} = focusManageLib;
const data = [
  {type: 'nav', name: '1'},
  {type: 'nav', name: '2'},
  {type: 'nav', name: '3'},
  {type: 'nav', name: '4'},
  {type: 'nav', name: '5'}
];

class Nav extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.showOrHideSubNav = this.showOrHideSubNav.bind(this);
    this.onBeforeLeave = this.onBeforeLeave.bind(this);
  }
  showOrHideSubNav() {
    this.setState({
      show: !this.state.show
    });
  }
  onBeforeLeave(e) {
    if (e.eventType === 'right' && this.state.show === true) {
      zIndexChange('up');
    }
  }
  render () {
    return (
      <div className="nav-wrap">
        {
          data.map(({type, name}) => {
            return (
              <Focus key={name}
                onOk={this.showOrHideSubNav}
                onBeforeLeave={this.onBeforeLeave}
              >
                <div className="cube">1</div>
              </Focus>
            )
          })
        }
        <SubNav
          show={this.state.show}
          showOrHideSubNav={this.showOrHideSubNav}
        />
      </div>
    );
  }
}

export default Nav;
