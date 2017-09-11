import React from 'react';
import {Focus} from '../../src';
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
  {type: 'lists', name: '9'}
];

const onOk = (e) => {
  alert(`我被点击了我是:${e.element.innerHTML}`);
};

const onEdge = (e) => {
  let {eventType} = e;
  if (eventType === 'up' || eventType === 'down') {
    alert(`当前方向:${eventType} 我到边界了可以执行翻页加载了新数据了`);
  }
};

const VideoLists = () => {
  return (
    <div className="videolist-wrap">
      {
        data.map(({type, name}) => {
          return (
            <Focus
              key={name}
              onOk={onOk}
              onEdge={onEdge}
            >
              <Cube type={type} name={name} />
            </Focus>
          );
        })
      }
    </div>
  );
};

export default VideoLists;
