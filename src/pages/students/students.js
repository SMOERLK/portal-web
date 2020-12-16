import React, { useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';

import './students.scss';
import { getStudents, setStudent } from '../../api/students';
import { ViewBooleanComponent, EditBooleanComponent, ViewOptionComponent, EditOptionComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS, DEVICES, CONNECTION_TYPES, GRADES } from '../../options';

export default function Students(props) {
  const { match, location } = props;
  const { institution_id } = match.params;
  const { institution_name } = location.state;

  const [editedRowOldValues, setEditedRowOldValues] = useState({});

  const store = new CustomStore({
    key: 'student_id',
    load: async function() {
      return getStudents(institution_id)
        .then((students) => { return students })
        .catch(() => notify("Internal server error. Failed to fetch data.", 'error', 3000))
    },
    update: async function(key, values) {
      var requestData = values;
      requestData.id = key;

      if(!values.hasOwnProperty('additional_data')) {
        requestData.additional_data = editedRowOldValues.additional_data;
      }
      else {
        if(!values.additional_data.hasOwnProperty('has_internet_connection')) { requestData.additional_data.has_internet_connection = editedRowOldValues.additional_data.has_internet_connection }
        if(!values.additional_data.hasOwnProperty('has_electricity'))         { requestData.additional_data.has_electricity = editedRowOldValues.additional_data.has_electricity }
        if(!values.additional_data.hasOwnProperty('has_telephone'))           { requestData.additional_data.has_telephone = editedRowOldValues.additional_data.has_telephone }
      }

      if(!values.tv_channels)    { requestData.tv_channels = editedRowOldValues.tv_channels || [] }
      if(!values.radio_channels) { requestData.radio_channels = editedRowOldValues.radio_channels || [] }
      
      setEditedRowOldValues({});

      return setStudent(requestData)
        .then((response) => {
          switch(response.status) {
            case 200: notify("Updated successfully.", 'success', 3000); break;
            case 401: notify("Unauthorized attempt.", 'error', 3000); break;
            default : notify("Update failed.", 'error', 3000);
          }
        })
        .catch(() => notify("Internal server error. Could not perform update.", 'error', 3000))
    }
  })

  const validateAdditionalData = (additionalDataNew, additionalDataOld) => {
    const additional_data_new = additionalDataNew || {};
    const additional_data_old = additionalDataOld || {};

    let requiredColumns = [];

    if(!additional_data_new.hasOwnProperty('has_internet_connection') && !additional_data_old.hasOwnProperty('has_internet_connection')) { requiredColumns.push(' Internet') }
    if(!additional_data_new.hasOwnProperty('has_electricity')         && !additional_data_old.hasOwnProperty('has_electricity'))         { requiredColumns.push(' Electricity') }
    if(!additional_data_new.hasOwnProperty('has_telephone')           && !additional_data_old.hasOwnProperty('has_telephone'))           { requiredColumns.push(' Telephone') }

    const requiredColumnsLength = requiredColumns.length;

    if(requiredColumnsLength) {
      const an = requiredColumnsLength == 1 ? "an " : "";
      const s = requiredColumnsLength > 1 ? "s" : "";
      const notification = "Please select " + an + "option" + s + " for" + requiredColumns.toString() + " column" + s + ".";
      
      notify(notification, 'error', 3000);
      return false;
    }

    return true;
  }

  const handleOnSaving = async (e) => {
    const changes = e.changes[0];

    if(changes === undefined) {
      notify("No changes made. Nothing to update.", 'info', 3000);
    }
    else{
      const dataSource = e.component.getDataSource();
      const editedRowOldValues = dataSource._items.filter((object) => object.id === changes.key)[0];

      setEditedRowOldValues(editedRowOldValues);

      const additional_data_new = changes.data.additional_data;
      const additional_data_old = editedRowOldValues.additional_data;

      if(!validateAdditionalData(additional_data_new, additional_data_old)) {
        e.cancel = true;
      }
    }
  }

  return (
    <React.Fragment>
      <h2 className={'content-block'}>Students of {institution_name}</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={store}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onSaving={handleOnSaving}
        onEditCanceled={() => notify("Edit cancelled.", 'info', 2000)}
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
          calculateCellValue={(rowData) => { return rowData.education_grade_id && GRADES[rowData.education_grade_id] }}
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
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && DEVICES[row.data.additional_data.type_of_device]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(DEVICES).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          caption={'Type of Device at Home'}
          dataField={'additional_data.type_of_device_at_home'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.type_of_device_at_home }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && DEVICES[row.data.additional_data.type_of_device_at_home]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(DEVICES).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
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
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && DEVICES[row.data.additional_data.internet_device]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(DEVICES).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          caption={'Connection Type'}
          dataField={'additional_data.connection_type'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.connection_type }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && CONNECTION_TYPES[row.data.additional_data.connection_type]} /> }}
          editCellComponent={EditOptionComponent}
        >
          <Lookup
            dataSource={Object.entries(CONNECTION_TYPES).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
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