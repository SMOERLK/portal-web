import React from 'react';

import './ViewOptionComponent.scss'


export default function ViewOptionComponent (props) {
  const { value } = props;

  return (
    value ? <div className={'option'}>{value}</div> : <div></div>
  )
}