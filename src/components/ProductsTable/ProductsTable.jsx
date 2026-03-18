import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo } from 'react';

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useDeleteProductMutation, useUpdateProductsMutation } from '../../store/api/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProductsTable = ({ data }) => {
  const [updateProducts] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductMutation();

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

  const handleDelete = useCallback(
    async id => {
      if (window.confirm('Delete?')) {
        await deleteProduct({ id }).unwrap();
        toast.success('Deleted');
      }
    },
    [deleteProduct],
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
      {
        headerName: 'Delete',
        field: 'id',
        flex: 1,
        sortable: false,
        filter: false,
        cellRendererParams: {
          onDelete: handleDelete,
        },
        cellRenderer: params => (
          <button
            onClick={() => params.onDelete(params.data.id)}
            style={{
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '4px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '12px',
            }}
          >
            Delete
          </button>
        ),
      },
    ],
    [handleDelete],
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
