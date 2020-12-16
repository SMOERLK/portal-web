import React, { useEffect, useState } from 'react';
import DataGrid, { Column, Pager, Paging, FilterRow, Editing, Lookup } from 'devextreme-react/data-grid';
import { Button } from 'devextreme-react/button';
import notify from 'devextreme/ui/notify';

import './institutions.scss';
import { getInstitutions, setInstitution } from '../../api/institutions';
import { ViewBooleanComponent, EditBooleanComponent, ViewChannelsComponent, EditChannelsComponent } from '../../components';
import { TV_CHANNELS, RADIO_CHANNELS } from '../../options';

export default function Institutions(props) {
  const [institutions, setInstitutions] = useState([]);

  useEffect(() => {
    getInstitutions().then((data) => setInstitutions(data));
  }, []);

  const handleOnSaved = async (data) => {
    setInstitution(data).then((response) => {
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
      <h2 className={'content-block'}>Institutions in Colombo Zone</h2>

      <DataGrid
        className={'dx-card wide-card'}
        dataSource={institutions}
        keyExpr={'id'}
        showBorders={false}
        focusedRowEnabled={true}
        defaultFocusedRowIndex={0}
        columnAutoWidth={true}
        columnHidingEnabled={true}
        onSaved={(data) => handleOnSaved(data.changes[0].data)}
        repaintChangesOnly={true}
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
