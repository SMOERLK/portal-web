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
  const [editedRowUpdatedValues, setEditedRowUpdatedValues] = useState(null);

  const store = new CustomStore({
    key: 'id',
    load: async function() {
      return getInstitutions()
        .then((institutions) => { return institutions })
        .catch(() => notify("Internal server error. Failed to fetch data.", 'error', 3000))
    },
    update: async function() {
      return setInstitution(editedRowUpdatedValues)
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

  const validateAdditionalData = (additional_data) => {
    const { has_internet_connection, has_electricity, has_telephone } = additional_data;

    let requiredColumns = [];

    if(has_internet_connection === null) { requiredColumns.push(' Internet') }
    if(has_electricity === null)         { requiredColumns.push(' Electricity') }
    if(has_telephone === null)           { requiredColumns.push(' Telephone') }

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
      const rowData = dataSource._items.filter((object) => object.id === changes.key)[0];
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
      id: rowData.id,
      additional_data: {
        has_internet_connection: _updateValue(changes.additional_data, rowData.additional_data, 'has_internet_connection'),
        has_electricity        : _updateValue(changes.additional_data, rowData.additional_data, 'has_electricity'),
        has_telephone          : _updateValue(changes.additional_data, rowData.additional_data, 'has_telephone'),
      },
      tv_channels   : _updateValue(changes, rowData, 'tv_channels') || [],
      radio_channels: _updateValue(changes, rowData, 'radio_channels') || [],
    }

    return updatedValues;
  }

  const _updateValue = (newValues, currentValues, key) => {
    if(newValues.hasOwnProperty(key))     { return newValues[key] }
    if(currentValues.hasOwnProperty(key)) { return currentValues[key] }
    return null;
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
