import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo } from 'react';

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useUpdateProductsMutation } from '../../store/api/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProductsTable = ({ data }) => {
  const [updateProducts] = useUpdateProductsMutation();

  const onUpdatedProduct = useCallback(
    async e => {
      try {
        await updateProducts({
          ...e.data,
          [e.colDef.field]: e.newValue,
        }).unwrap();
        toast.success('Product is updated!');
      } catch (error) {
        toast.error('Failed to update product');
        console.error('Update product error:', error);
      }
    },
    [updateProducts],
  );

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
        valueFormatter: params => params.value ?? '',
      },
      {
        field: 'isEnabled',
        headerName: 'Available',
        flex: 1,
        editable: true,
        cellRenderer: params => (params.value ? '🟢 Yes' : '🔴 No'),
      },
      {
        field: 'updatedAt',
        headerName: 'Updated',
        flex: 1,
        valueFormatter: params => dayjs(params.value).format('DD.MM.YY HH:mm'),
      },
      {
        field: 'limitPerOrder',
        headerName: 'Limit',
        editable: true,
        flex: 1,
        valueFormatter: params => params.value || 'No limit',
        valueParser: params => (params.newValue === '0' ? null : Number(params.newValue)),
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
    <div style={{ height: 500, width: '100%', marginTop: 10 }}>
      <AgGridReact
        onCellEditRequest={onUpdatedProduct}
        rowData={data}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        animateRows={true}
        rowSelection="multiple"
        theme={themeQuartz}
        readOnlyEdit={true}
      />
    </div>
  );
};

export default ProductsTable;
