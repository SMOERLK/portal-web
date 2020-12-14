import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';

import { getStudents } from '../../api/students';
import { ViewBooleanComponent, EditBooleanComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS } from '../../options';

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
        keyExpr={'id'}
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
          dataField={'additional_data.student_id'}
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
          caption={'Internet at Home'}
          dataField={'additional_data.internet_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.internet_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.internet_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          caption={'TV at Home'}
          dataField={'additional_data.tv_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.tv_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.tv_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          caption={'Satellite TV at Home'}
          dataField={'additional_data.satellite_tv_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.satellite_tv_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.satellite_tv_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={200}
          caption={'TV Channels'}
          dataField={'tv_channels'}
          calculateCellValue={(rowData) => { return rowData.tv_channels.map((channel) => channel.channel_id) }}
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={TV_CHANNELS} channels={row.data.tv_channels}/> }}
          editCellComponent={EditChannelsComponent}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { channel_id: data[0], option: data[1] }})}
            valueExpr="channel_id"
            displayExpr="option"
          />
        </Column>

        <Column
          width={200}
          caption={'Radio Channels'}
          dataField={'radio_channels'}
          calculateCellValue={(rowData) => { return rowData.radio_channels.map((channel) => channel.channel_id) }}
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={RADIO_CHANNELS} channels={row.data.radio_channels}/> }}
          editCellComponent={EditChannelsComponent}
        >
          <Lookup
            dataSource={Object.entries(RADIO_CHANNELS).map(data => { return { channel_id: data[0], option: data[1] }})}
            valueExpr="channel_id"
            displayExpr="option"
          />
        </Column>

      </DataGrid>
    </React.Fragment>
  )
}