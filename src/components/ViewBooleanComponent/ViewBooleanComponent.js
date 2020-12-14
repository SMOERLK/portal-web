import React from 'react';

import './ViewBooleanComponent.scss'

export default function ViewBooleanComponent (props) {
  const { value } = props;

  if(value == 0 || value == 1) {
    return (
      value ? <div className={'bool-view yes'}>Yes</div> : <div className={'bool-view no'}>No</div>
    )
  }
  else {
    return <div className={'not-available'}>N/A</div>
  }
}