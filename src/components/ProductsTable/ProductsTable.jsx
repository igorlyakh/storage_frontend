import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo, useState } from 'react';

import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import {
  useCreateWarehouseRequestMutation,
  useDeleteProductMutation,
  useUpdateProductsMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

ModuleRegistry.registerModules([AllCommunityModule]);

const ProductsTable = ({ data }) => {
  const userRole = useSelector(userRoleSelector);
  const [updateProducts] = useUpdateProductsMutation();
  const [deleteProduct] = useDeleteProductMutation();
  const [createWarehouseRequest, { isLoading: isSending }] =
    useCreateWarehouseRequestMutation();

  const [orderQuantities, setOrderQuantities] = useState({});

  const isWarehouse = userRole === 'WAREHOUSE';

  const tableData = useMemo(() => {
    return data?.map(item => ({
      ...item,
      orderQuantity: orderQuantities[item.id] || null,
    }));
  }, [data, orderQuantities]);

  const onUpdatedProduct = useCallback(
    async e => {
      if (e.colDef.field === 'orderQuantity') {
        const newValue = parseInt(e.newValue, 10);
        setOrderQuantities(prev => {
          const nextState = { ...prev };
          if (!isNaN(newValue) && newValue > 0) {
            nextState[e.data.id] = newValue;
          } else {
            delete nextState[e.data.id];
          }
          return nextState;
        });
        return;
      }

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

  const handleSendOrder = async () => {
    const items = Object.entries(orderQuantities).map(([productId, quantity]) => ({
      productId,
      quantity,
    }));

    if (items.length === 0) {
      return toast.error('Please specify quantity for at least one product');
    }

    try {
      await createWarehouseRequest({ items }).unwrap();
      toast.success('Request sent to admin successfully!');
      setOrderQuantities({});
    } catch (error) {
      toast.error('Failed to send request');
      console.error(error);
    }
  };

  // ДИНАМИЧЕСКИЕ КОЛОНКИ
  const columnDefs = useMemo(() => {
    const baseColumns = [
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
        headerName: 'Stock',
        flex: 1,
        cellStyle: params => {
          if (params.value < 0) return { color: '#ef4444', fontWeight: 'bold' };
          return null;
        },
        valueFormatter: params => params.value ?? '',
      },
    ];

    // Добавляем колонку для заказа ТОЛЬКО если это склад
    if (isWarehouse) {
      baseColumns.push({
        field: 'orderQuantity',
        headerName: 'To Order (Qty)',
        flex: 1,
        editable: true,
        cellStyle: { backgroundColor: '#f0fdf4', fontWeight: 'bold' },
        valueParser: params => params.newValue,
      });
    }

    // Добавляем остальные общие колонки
    baseColumns.push(
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
    );

    return baseColumns;
  }, [handleDelete, isWarehouse]);

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    [],
  );

  const totalItemsToOrder = Object.keys(orderQuantities).length;

  return (
    <div>
      {/* ПАНЕЛЬ ЗАКАЗА ВИДНА ТОЛЬКО СКЛАДУ */}
      {isWarehouse && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 10,
          }}
        >
          <div>
            {totalItemsToOrder > 0 && (
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#16a34a' }}>
                Selected products: {totalItemsToOrder}
              </span>
            )}
          </div>
          <button
            onClick={handleSendOrder}
            disabled={isSending || totalItemsToOrder === 0}
            style={{
              backgroundColor: totalItemsToOrder > 0 ? '#16a34a' : '#d1d5db',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              cursor: totalItemsToOrder > 0 ? 'pointer' : 'not-allowed',
              fontWeight: 'bold',
            }}
          >
            {isSending ? 'Sending...' : 'Send Request'}
          </button>
        </div>
      )}

      <div style={{ height: 500, width: '100%', marginTop: 10 }}>
        <AgGridReact
          onCellEditRequest={onUpdatedProduct}
          rowData={tableData}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
          theme={themeQuartz}
          readOnlyEdit={true}
        />
      </div>
    </div>
  );
};

export default ProductsTable;
