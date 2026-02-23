import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProductsTable = ({ data }) => {
  const columnDefs = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Product name',
        flex: 2,
        filter: 'agTextColumnFilter',
        editable: true,
      },
      {
        field: 'category',
        headerName: 'Category',
        flex: 1,
      },
      {
        field: 'stock.quantity',
        headerName: 'Quantity',
        flex: 1,
        cellStyle: params => {
          if (params.value < 0) return { color: '#ef4444', fontWeight: 'bold' };
          return null;
        },
        valueFormatter: params => `${params.value}`,
      },
      {
        field: 'isEnabled',
        headerName: 'Available',
        flex: 1,
        cellRenderer: params => <span>{params.value ? '🟢 Yes' : '🔴 No'}</span>,
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 1,
        valueFormatter: params => new Date(params.value).toLocaleDateString(),
      },
      {
        field: 'limitPerOrder',
        headerName: 'Limit',
        flex: 1,
        cellRenderer: params => <span>{params.value ? params.value : 'No limit'}</span>,
      },
    ],
    [],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  return (
    <div
      className="ag-theme-quartz"
      style={{ height: 500, width: '100%' }}
    >
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

export default ProductsTable;
