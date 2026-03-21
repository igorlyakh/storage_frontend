import { themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
import { useMemo, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useSendOrderMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const OrderItemsTable = ({ data }) => {
  const userRole = useSelector(userRoleSelector);
  const gridRef = useRef(null);
  const [sendOrder, { isLoading }] = useSendOrderMutation();
  const { id: orderId } = useParams();

  const hasAccess = userRole === 'ADMIN' || userRole === 'WAREHOUSE';

  const gridData = useMemo(() => {
    if (!data) return [];
    return structuredClone(data);
  }, [data]);

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
        editable: hasAccess,
        cellEditor: 'agNumberCellEditor',
      },
    ],
    [hasAccess],
  );

  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      resizable: true,
      filter: false,
    }),
    [],
  );

  const handleSendOrder = async () => {
    if (!gridRef.current) return;

    const items = [];

    gridRef.current.api.forEachNode(node => {
      const rowData = node.data;
      const productId = rowData.product.id;

      const quantity = rowData.shippedQty
        ? Number(rowData.shippedQty)
        : Number(rowData.requestedQty);

      items.push({
        productId,
        quantity,
      });
    });

    try {
      await sendOrder({ orderId, items }).unwrap();
      console.log('Order sent successfully!');
    } catch (error) {
      console.error('Failed to send order:', error);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ height: 500, width: '100%', marginTop: 10 }}>
        <AgGridReact
          ref={gridRef}
          rowData={gridData} // <--- ПЕРЕДАЕМ СКОПИРОВАННЫЕ ДАННЫЕ СЮДА
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          animateRows={true}
          rowSelection="multiple"
          theme={themeQuartz}
          stopEditingWhenCellsLoseFocus={true}
        />
      </div>

      {hasAccess && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {/* ... кнопка ... */}
          <button
            onClick={handleSendOrder}
            disabled={isLoading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#7c3aed',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? 'Sending...' : 'Send order'}
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderItemsTable;
