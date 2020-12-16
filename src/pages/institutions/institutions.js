import React, { useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

import './institutions.scss';
import { getInstitutions, setInstitution } from '../../api/institutions';
import { ViewBooleanComponent, EditBooleanComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS } from '../../options';

export default function Institutions(props) {
  const [editedRowOldValues, setEditedRowOldValues] = useState({});

  const store = new CustomStore({
    key: 'id',
    load: async function() {
      return getInstitutions()
        .then((institutions) => { return institutions })
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

      return setInstitution(requestData)
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
      <h2 className={'content-block'}>Institutions in Colombo Zone</h2>

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
          dataField={'id'}
          caption={'ID'}
          allowEditing={false}
        />
        <Column
          dataField={'code'}
          caption={'Census ID'}
          allowEditing={false}
        />
        <Column
          dataField={'name'}
          caption={'Name'}
          allowEditing={false}
        />
        <Column
          dataField={'address'}
          caption={'Address'}
          allowEditing={false}
        />
        <Column
          dataField={'postal_code'}
          caption={'Postal Code'}
          hidingPriority={3}
          allowEditing={false}
        />
        <Column
          dataField={'contact_person'}
          caption={'Contact Person'}
          hidingPriority={4}
          allowEditing={false}
        />
        <Column
          dataField={'fax'}
          caption={'Fax'}
          hidingPriority={1}
          allowEditing={false}
        />
        <Column
          dataField={'email'}
          caption={'Email'}
          hidingPriority={2}
          allowEditing={false}
        />

        <Column
          width={150}
          caption={'Internet'}
          dataField={'additional_data.has_internet_connection'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_internet_connection ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_internet_connection}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
          caption={'Electricity'}
          dataField={'additional_data.has_electricity'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_electricity ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_electricity}/> }}
          editCellComponent={EditBooleanComponent}
        >
          <Lookup dataSource={['Yes', 'No']} />
        </Column>

        <Column
          width={150}
          caption={'Telephone'}
          dataField={'additional_data.has_telephone'}
          calculateCellValue={(rowData) => { return rowData.additional_data ? rowData.additional_data.has_telephone ? 'Yes' : 'No' : null}}
          cellRender={(row) => { return <ViewBooleanComponent value={row.data.additional_data && row.data.additional_data.has_telephone}/> }}
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
          hidingPriority={6}
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
          hidingPriority={5}
        >
          <Lookup
            dataSource={Object.entries(RADIO_CHANNELS).map(data => { return { id: data[0], name: data[1] }})}
            valueExpr="id"
            displayExpr="name"
          />
        </Column>
        
        <Column
          caption={'Students'}
          cellRender={(row) => {
            return (
              <Button
                text="View"
                elementAttr={{ class: "view-button" }}
                stylingMode="contained"
                onClick={() => props.history.push({
                  pathname: '/students?institution_id=' + row.data.id,
                  state: { institution_name: row.data.name }
                })}
              />
            )
          }}
          allowEditing={false}
        />

      </DataGrid>
    </React.Fragment>
  )
}
