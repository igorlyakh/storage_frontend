import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { api, useCreateOrderMutation, useGetAllProductsQuery } from '../../store/api/api';

ModuleRegistry.registerModules([AllCommunityModule]);

const CreateOrderTable = () => {
  const dispatch = useDispatch();

  const { data: products = [] } = useGetAllProductsQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const rowData = useMemo(() => products.filter(p => p.isEnabled), [products]);

  const onCellValueChanged = useCallback(
    params => {
      const productId = params.data.id;
      const newValue = params.newValue;

      dispatch(
        api.util.updateQueryData('getAllProducts', undefined, draft => {
          const product = draft.find(p => p.id === productId);
          if (product) {
            product.orderQuantity = newValue > 0 ? newValue : undefined;
          }
        }),
      );
    },
    [dispatch],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'name',
        headerName: 'Product Name',
        flex: 2,
      },
      {
        field: 'orderQuantity',
        headerName: 'Quantity to Order',
        flex: 1,
        editable: true,
        valueParser: params => {
          const num = Number(params.newValue);
          return isNaN(num) ? 0 : num;
        },
        cellStyle: params =>
          params.value > 0
            ? {
                backgroundColor: '#dcfce7',
                fontWeight: 'bold',
                border: '1px solid #22c55e',
              }
            : null,
      },
    ],
    [],
  );

  const handleSendOrder = async () => {
    const items = products
      .filter(p => p.orderQuantity > 0)
      .map(p => ({
        name: p.name,
        quantity: p.orderQuantity,
      }));

    if (items.length === 0) {
      return toast.error('Please specify quantity for at least one product');
    }

    try {
      await createOrder({ items }).unwrap();
      toast.success('Order created successfully!');

      dispatch(
        api.util.updateQueryData('getAllProducts', undefined, draft => {
          draft.forEach(p => {
            delete p.orderQuantity;
          });
        }),
      );
    } catch (error) {
      toast.error('Failed to create order');
      console.error(error);
    }
  };

  return (
    <div style={{ width: '100%', marginTop: 20 }}>
      <div
        className="ag-theme-quartz"
        style={{ height: 500, width: '100%' }}
      >
        <AgGridReact
          rowData={rowData}
          columnDefs={columnDefs}
          onCellEditRequest={onCellValueChanged}
          readOnlyEdit={true}
          animateRows={true}
          singleClickEdit={true}
          theme={themeQuartz}
        />
      </div>

      <div style={{ marginTop: 15, display: 'flex', justifyContent: 'flex-end' }}>
        <button
          disabled={isLoading}
          onClick={handleSendOrder}
          style={{
            backgroundColor: '#2563eb',
            color: 'white',
            padding: '10px 25px',
            borderRadius: '6px',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            fontWeight: '600',
          }}
        >
          {isLoading ? 'Sending...' : 'Confirm Order'}
        </button>
      </div>
    </div>
  );
};

export default CreateOrderTable;
