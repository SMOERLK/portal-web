import React from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';

import  { schools } from './data';
import './schools.scss';

const viewButton = () => {
  return (
    <Button
      text="View Students"
      elementAttr={{class:"view-button"}}
      stylingMode="contained"
      onClick={() => {}}
    />
  )
}

export default () => (
  <React.Fragment>
    <h2 className={'content-block'}>Schools in Colombo Zone</h2>

    <DataGrid
      className={'dx-card wide-card'}
      dataSource={schools}
      showBorders={false}
      focusedRowEnabled={true}
      defaultFocusedRowIndex={0}
      columnAutoWidth={true}
      columnHidingEnabled={true}
    >
      <Paging defaultPageSize={10} />
      <Pager showPageSizeSelector={true} showInfo={true} />
      <FilterRow visible={true} />
    
      <Column
        dataField={'census_id'}
        width={150}
        caption={'Census ID'}
        hidingPriority={8}
      />
      <Column
        dataField={'school_name'}
        width={400}
        caption={'School Name'}
        hidingPriority={6}
      />
      <Column
        dataField={'school_address'}
        width={400}
        caption={'School Address'}
        hidingPriority={6}
      />

      <Column cellRender={viewButton} />
    </DataGrid>
  </React.Fragment>
);
