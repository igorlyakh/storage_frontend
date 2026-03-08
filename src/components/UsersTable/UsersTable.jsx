import { themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

const UsersTable = ({ data }) => {
  const columnDefs = useMemo(
    () => [
      {
        field: 'username',
        headerName: 'Username',
        flex: 1,
      },
      {
        field: 'role',
        headerName: 'Role',
      },
      {
        field: 'store.name',
        headerName: 'Store',
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: true,
    }),
    [],
  );

  return (
    <div style={{ height: 500, width: '100%', marginTop: 10 }}>
      <AgGridReact
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        theme={themeQuartz}
      />
    </div>
  );
};

export default UsersTable;
