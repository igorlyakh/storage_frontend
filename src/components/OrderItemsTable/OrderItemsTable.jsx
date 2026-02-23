import { themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo } from 'react';

const OrderItemsTable = ({ data }) => {
  const columnDefs = useMemo(
    () => [
      {
        field: 'product.name',
        headerName: 'Product',
        flex: 2,
      },
      {
        field: 'requestedQty',
        headerName: 'Requested Quantity',
        flex: 1,
      },
      {
        field: 'shippedQty',
        headerName: 'Shipped Quantity',
        flex: 1,
      },
    ],
    [],
  );
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
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

export default OrderItemsTable;
