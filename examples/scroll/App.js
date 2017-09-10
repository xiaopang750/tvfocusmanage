import React from 'react';
import './app2.css';
import {Focus, FocusScroll} from '../../src';
import Cube from '../Cube';

const data = [
  {type: 'lists', name: '1'},
  {type: 'lists', name: '2'},
  {type: 'lists', name: '3'},
  {type: 'lists', name: '4'},
  {type: 'lists', name: '5'},
  {type: 'lists', name: '6'},
  {type: 'lists', name: '7'},
  {type: 'lists', name: '8'},
  {type: 'lists', name: '9'},
  {type: 'lists', name: '10'},
  {type: 'lists', name: '11'},
  {type: 'lists', name: '12'},
  {type: 'lists', name: '13'},
  {type: 'lists', name: '14'}
];

const App = () => {
  let num = data.length;
  let unit = 120;
  let sum = unit * num;
  return (
    <FocusScroll>
      <div>
        <FocusScroll className="scroll-nav-wrap" data-dir="h">
          <div className="scroll-nav-h clearfix" style={{width: `${sum}px`}}>
            {
              data.map((item, index) => {
                let {type, name} = item;
                return (
                  <Focus
                    key={index}
                  >
                    <Cube type={type} name={name} />
                  </Focus>
                )
              })
            }
          </div>
        </FocusScroll>
        <FocusScroll className="scroll-nav-wrap" data-dir="h">
          <div className="scroll-nav-h clearfix" style={{width: `${sum}px`}}>
            {
              data.map((item, index) => {
                let {type, name} = item;
                return (
                  <Focus
                    key={index}
                  >
                    <Cube type={type} name={name} />
                  </Focus>
                )
              })
            }
          </div>
        </FocusScroll>
        <div className="clearfix">
          <FocusScroll className="scroll-nav-wrap" data-dir="v" style={{float: 'left'}}>
            <div className="scroll-nav-v">
              {
                data.map((item, index) => {
                  let {type, name} = item;
                  return (
                    <Focus
                      key={index}
                    >
                      <Cube name={name} />
                    </Focus>
                  )
                })
              }
            </div>
          </FocusScroll>
          <FocusScroll className="scroll-nav-wrap" data-dir="v" style={{float: 'left'}}>
            <div className="scroll-nav-v">
              {
                data.map((item, index) => {
                  let {type, name} = item;
                  return (
                    <Focus
                      key={index}
                    >
                      <Cube name={name} />
                    </Focus>
                  )
                })
              }
            </div>
          </FocusScroll>
        </div>
        <div className="clearfix" style={{marginTop: '10px', width: '400px'}}>
          <Focus>
            <Cube name="foo" type="lists" />
          </Focus>
          <Focus>
            <Cube name="foo" type="lists" />
          </Focus>
          <Focus>
            <Cube name="foo" type="lists" />
          </Focus>
          <Focus>
            <Cube name="foo" type="lists" />
          </Focus>
        </div>
      </div>
    </FocusScroll>
  )
};

export default App;
