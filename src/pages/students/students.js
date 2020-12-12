import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';

import { ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { getStudents } from '../../api/students';

const tv = require('./tv.json');
const radio = require('./radio.json');

export default function Students(props) {
  const { match, location } = props;
  const { institution_id } = match.params;
  const { institution_name } = location.state;

  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents(institution_id).then((data) => setStudents(data));
  }, []);

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Students of {institution_name}</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={students}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
      >
        <Paging defaultPageSize={10} />
        <Pager showPageSizeSelector={true} showInfo={true} />
        <FilterRow visible={true} />
        <Editing
          allowUpdating={true}
          allowAdding={false}
          allowDeleting={false}
          mode="row"
        />

        <Column
          dataField={'student_profile.id'}
          caption={'ID'}
          allowEditing={false}
        />
        <Column
          dataField={'student_profile.openemis_no'}
          caption={'NSID'}
          allowEditing={false}
        />
        <Column
          dataField={'student_profile.first_name'}
          caption={'First Name'}
          allowEditing={false}
        />
        <Column
          dataField={'student_profile.last_name'}
          caption={'Last Name'}
          allowEditing={false}
        />
        <Column
          dataField={'education_grade_id'}
          caption={'Grade'}
          allowEditing={false}
        />
        <Column
          dataField={'student_profile.address'}
          caption={'Address'}
          allowEditing={false}
        />

        <Column
          width={200}
          caption={'TV Channels'}
          dataField={'tv_channels'}
          cellRender={(row) => { return <ViewChannelsComponent data={tv} channels={row.data.tv_channels}/> }}
          editCellComponent={EditChannelsComponent}
        >
          <Lookup
            dataSource={Object.entries(tv).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          width={200}
          caption={'Radio Channels'}
          dataField={'radio_channels'}
          cellRender={(row) => { return <ViewChannelsComponent data={radio} channels={row.data.radio_channels}/> }}
          editCellComponent={EditChannelsComponent}
        >
          <Lookup
            dataSource={Object.entries(radio).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

      </DataGrid>
    </React.Fragment>
  )
}