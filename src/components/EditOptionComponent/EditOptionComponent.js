import React, { useCallback } from 'react';
import SelectBox from 'devextreme-react/select-box';

import './EditOptionComponent.scss'

export default function EditOptionComponent (props) {
  const onValueChange = useCallback(
    (value) => { props.data.setValue(value) }, []
  )  

  return (
    <SelectBox
      items={props.data.column.lookup.dataSource}
      valueExpr="id"
      displayExpr="name"
      placeholder="Select"
      value={props.value}
      onValueChange={onValueChange}
      showClearButton={true} />
  )
}