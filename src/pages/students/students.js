import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import notify from 'devextreme/ui/notify';

import { getStudents, setStudent } from '../../api/students';
import { ViewBooleanComponent, EditBooleanComponent, ViewOptionComponent, EditOptionComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS } from '../../options';

export default function Students(props) {
  const { match, location } = props;
  const { institution_id } = match.params;
  const { institution_name } = location.state;

  const [students, setStudents] = useState([]);

  useEffect(() => {
    getStudents(institution_id).then((data) => setStudents(data));
  }, []);

  const handleOnSaved = async (data) => {
    setStudent(data).then((response) => {
      if(response.status === 200) {
        notify("Updated successfully", 'success', 2000);
      }
      else if(response.status === 401) {
        notify("Unauthorized attempt", 'error', 2000);
      }
      else {
        notify("Update failed", 'error', 2000);
      }
    })
  }

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
        onSaved={(data) => handleOnSaved(data.changes[0].data)}
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
          dataField={'student_id'}
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
          hidingPriority={2}
        />
        <Column
          dataField={'student_profile.address'}
          caption={'Address'}
          allowEditing={false}
          hidingPriority={1}
        />

        <Column
          caption={'Type of Device'}
          dataField={'additional_data.type_of_device'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.type_of_device }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && TV_CHANNELS[row.data.additional_data.type_of_device]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { id: data[0], option: data[1] }})}
            valueExpr="id"
            displayExpr="option"
          />
        </Column>

        <Column
          caption={'Type of Device at Home'}
          dataField={'additional_data.type_of_device_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.type_of_device_at_home }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && TV_CHANNELS[row.data.additional_data.type_of_device_at_home]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { id: data[0], option: data[1] }})}
            valueExpr="id"
            displayExpr="option"
          />
        </Column>

        <Column
          width={150}
          caption={'Internet at Home'}
          dataField={'additional_data.internet_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.internet_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.internet_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          caption={'Internet Device'}
          dataField={'additional_data.internet_device'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.internet_device }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && TV_CHANNELS[row.data.additional_data.internet_device]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { id: data[0], option: data[1] }})}
            valueExpr="id"
            displayExpr="option"
          />
        </Column>

        <Column
          width={150}
          caption={'Electricity at Home'}
          dataField={'additional_data.electricity_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.electricity_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.electricity_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
          caption={'TV at Home'}
          dataField={'additional_data.tv_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.tv_at_home ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.tv_at_home}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
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
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={TV_CHANNELS} channels={row.data.tv_channels}/> }}
          editCellComponent={EditChannelsComponent}
          hidingPriority={3}
        >
          <Lookup
            dataSource={Object.entries(TV_CHANNELS).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          width={200}
          caption={'Radio Channels'}
          dataField={'radio_channels'}
          filterOperations={['contains']}
          cellRender={(row) => { return <ViewChannelsComponent data={RADIO_CHANNELS} channels={row.data.radio_channels}/> }}
          editCellComponent={EditChannelsComponent}
          hidingPriority={4}
        >
          <Lookup
            dataSource={Object.entries(RADIO_CHANNELS).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

      </DataGrid>
    </React.Fragment>
  )
}