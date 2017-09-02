import React from 'react';

const Cube = ({type = '', name, focusActive = ''}) => {
  return (
    <div className={`cube ${focusActive} ${type}`}>{name}</div>
  );
};

export default Cube;
