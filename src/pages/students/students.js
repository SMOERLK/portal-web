import React, { useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import notify from 'devextreme/ui/notify';

import './students.scss';
import { getStudents, setStudent } from '../../api/students';
import { ViewBooleanComponent, EditBooleanComponent, ViewOptionComponent, EditOptionComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS, DEVICES, INTERNET_DEVICES } from '../../options';

export default function Students(props) {
  const { match, location } = props;
  const { institution_id } = match.params;
  const { institution_name } = location.state;
  const { classes } = location.state;

  const [editedRowUpdatedValues, setEditedRowUpdatedValues] = useState(null);

  const store = new CustomStore({
    key: 'student_id',
    load: async function() {
      return getStudents(institution_id)
        .then((students) => { return students })
        .catch(() => notify("Internal server error. Failed to fetch data.", 'error', 3000))
    },
    update: async function() {
      return setStudent(editedRowUpdatedValues)
        .then((response) => {
          switch(response.status) {
            case 200: notify("Updated successfully.", 'success', 3000); break;
            case 401: notify("Unauthorized attempt.", 'error', 3000); break;
            default : notify("Update failed.", 'error', 3000);
          }
          setEditedRowUpdatedValues(null);
        })
        .catch(() => notify("Internal server error. Could not perform update.", 'error', 3000))
    }
  })

  const handleOnSaving = (e) => {
    const changes = e.changes[0];

    if(changes === undefined) {
      notify("No changes made. Nothing to update.", 'info', 3000);
    }
    else{
      const dataSource = e.component.getDataSource();
      const rowData = dataSource._items.filter((object) => object.student_id === changes.key)[0];
      const updatedValues = getUpdatedValues(rowData, changes.data);

      if(validateAdditionalData(updatedValues.additional_data)) {
        setEditedRowUpdatedValues(updatedValues);
      }
      else {
        e.cancel = true;
      }
    }
  }

  const getUpdatedValues = (rowData, changes) => {
    const updatedValues = {
      id: rowData.student_id,
      institution_id : rowData.institution_id,
      additional_data: _updateAdditionalData(changes, rowData),
      tv_channels    : _updateValue(changes, rowData, 'tv_channels') || [],
      radio_channels : _updateValue(changes, rowData, 'radio_channels') || [],
    }

    return updatedValues;
  }

  const _updateAdditionalData = (changes, rowData) => {
    const additional_data = [
      'type_of_device',
      'type_of_device_at_home',
      'internet_at_home',
      'internet_device',
      'electricity_at_home',
      'tv_at_home',
      'satellite_tv_at_home'
    ]

    var additionalData = {};

    additional_data.forEach((key) => {
      additionalData[key] = _updateValue(changes.additional_data, rowData.additional_data, key)
    })

    return additionalData;
  }

  const _updateValue = (changes, rowData, key) => {
    if(changes && changes.hasOwnProperty(key)) { return changes[key] }
    if(rowData && rowData.hasOwnProperty(key)) { return rowData[key] }
    return null;
  }

  const validateAdditionalData = (additional_data) => {
    const {
      type_of_device,
      type_of_device_at_home,
      internet_at_home,
      internet_device,
      electricity_at_home,
      tv_at_home,
      satellite_tv_at_home
    } = additional_data;

    let requiredColumns = [];

    if(type_of_device === null)         { requiredColumns.push(' Type of Device') }
    if(type_of_device_at_home === null) { requiredColumns.push(' Type of Device at Home') }
    if(internet_at_home === null)       { requiredColumns.push(' Internet at Home') }
    if(internet_device === null)        { requiredColumns.push(' Internet Device') }
    if(electricity_at_home === null)    { requiredColumns.push(' Electricity at Home') }
    if(tv_at_home === null)             { requiredColumns.push(' TV at Home') }
    if(satellite_tv_at_home === null)   { requiredColumns.push(' Satellite TV at Home') }

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
        wordWrapEnabled={false}
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
          dataField={'student_profile.openemis_no'}
          caption={'NSID'}
          allowEditing={false}
        />

        <Column
          dataField={'student_profile.first_name'}
          caption={'Full Name'}
          allowEditing={false}
        />

        <Column
          width={120}
          caption={'Class'}
          dataField={'class.institution_class_id'}
          calculateCellValue={(rowData) => { return rowData.class && rowData.class.institution_class_id}}
          allowEditing={false}
        >
          <Lookup
            dataSource={(classes || []).map(data => { return { id: data.id, name: data.name } })}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>

        <Column
          dataField={'student_profile.address'}
          caption={'Address'}
          allowEditing={false}
          allowFiltering={false}
          hidingPriority={1}
        />

        <Column
          caption={'Type of Device'}
          dataField={'additional_data.type_of_device'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.type_of_device }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && DEVICES[row.data.additional_data.type_of_device]} /> }}
          editCellComponent={EditOptionComponent}
          allowFiltering={false}
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
          allowFiltering={false}
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
          allowFiltering={false}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          caption={'Internet Device'}
          dataField={'additional_data.internet_device'}
          calculateCellValue={(rowData) => { return rowData.additional_data && rowData.additional_data.internet_device }}
          cellRender={(row) => { return <ViewOptionComponent value={row.data.additional_data && INTERNET_DEVICES[row.data.additional_data.internet_device]} /> }}
          editCellComponent={EditOptionComponent}
          allowFiltering={false}
        >
          <Lookup
            dataSource={Object.entries(INTERNET_DEVICES).map(data => { return { id: data[0], name: data[1] }})}
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
          allowFiltering={false}
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
          allowFiltering={false}
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
          allowFiltering={false}
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
          allowFiltering={false}
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
          allowFiltering={false}
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