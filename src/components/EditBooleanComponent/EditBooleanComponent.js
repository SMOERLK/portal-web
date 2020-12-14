import React, { useEffect, useState, useCallback } from 'react';

import './EditBooleanComponent.scss'

export default function EditBooleanComponent (props) {
  const { value } = props;

  const [classNameYes, setClassNameYes] = useState('bool');
  const [classNameNo, setClassNameNo] = useState('bool');

  useEffect(() => {
    if(value == 0) {
      setClassNameYes('bool');
      setClassNameNo('bool no');
    }
    else if(value == 1) {
      setClassNameYes('bool yes');
      setClassNameNo('bool');
    }
    else {
      setClassNameYes('bool');
      setClassNameNo('bool');
    }
  }, [])

  const onClickYes = () => {
    setClassNameYes('bool yes');
    setClassNameNo('bool');
    setValue(1);
  }

  const onClickNo = () => {
    setClassNameYes('bool');
    setClassNameNo('bool no');
    setValue(0);
  }

  const setValue = useCallback(
    (value) => { props.data.setValue(value) }, []
  )

  return (
    <div className={'bool-container'}>
      <div className={classNameYes} onClick={onClickYes}>Yes</div>
      <div className={classNameNo} onClick={onClickNo}>No</div>
    </div>
  )
}