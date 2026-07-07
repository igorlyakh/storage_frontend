import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';

import {
  useCreateWarehouseRequestMutation,
  useDecreaseProductMutation,
  useGetAllBrandsQuery,
  useIncreaseProductMutation,
  useUpdateProductsMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

import { useProductColumns } from './columns';
import DeleteProductModal from './DeleteProductModal';
import ProductsGroupedTable from './ProductsGroupedTable';
import SendRequestBar from './SendRequestBar';
import StockOperationModal from './StockOperationModal';

const ProductsTable = ({ data }) => {
  const userRole = useSelector(userRoleSelector);
  const isWarehouse = userRole === 'WAREHOUSE';
  const isAdmin = userRole === 'ADMIN';

  const { data: allBrands = [] } = useGetAllBrandsQuery();

  const [updateProducts] = useUpdateProductsMutation();
  const [createWarehouseRequest, { isLoading: isSending }] =
    useCreateWarehouseRequestMutation();

  const [increaseProduct, { isLoading: isIncreasing }] = useIncreaseProductMutation();
  const [decreaseProduct, { isLoading: isDecreasing }] = useDecreaseProductMutation();

  const [orderQuantities, setOrderQuantities] = useState({});

  const [openedDelete, setOpenedDelete] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  const [stockOpData, setStockOpData] = useState(null);
  const [stockQuantity, setStockQuantity] = useState(1);

  const handleUpdateProduct = useCallback(
    async (product, field, newValue) => {
      try {
        await updateProducts({ ...product, [field]: newValue }).unwrap();
        toast.success('Product updated!');
      } catch {
        toast.error('Failed to update product');
      }
    },
    [updateProducts],
  );

  const handleSendOrder = async () => {
    const payloadItems = Object.entries(orderQuantities)
      .map(([productId, orderData]) => {
        const product = data.find(p => String(p.id) === String(productId));
        if (!product) return null;

        return {
          productId: product.id,
          quantity: orderData.quantity,
          packageType: orderData.unit,
        };
      })
      .filter(Boolean);

    if (payloadItems.length === 0) {
      return toast.error('Please specify quantity for at least one product');
    }

    try {
      await createWarehouseRequest({ items: payloadItems }).unwrap();
      toast.success('Request sent successfully!');
      setOrderQuantities({});
    } catch {
      toast.error('Failed to send request');
    }
  };

  const handleOpenStockOp = useCallback((product, type) => {
    setStockOpData({ product, type });
    setStockQuantity(1);
  }, []);

  const closeStockOp = () => {
    setStockOpData(null);
    setStockQuantity(1);
  };

  const confirmStockOp = async () => {
    if (!stockOpData) return;
    const { product, type } = stockOpData;

    try {
      const payload = { id: product.id, quantity: stockQuantity };
      if (type === 'increase') {
        await increaseProduct(payload).unwrap();
      } else {
        await decreaseProduct(payload).unwrap();
      }
      toast.success(`Stock ${type}d successfully!`);
      closeStockOp();
    } catch (error) {
      toast.error(error?.data?.message || `Failed to ${type} stock`);
    }
  };

  const columns = useProductColumns({ isAdmin, isWarehouse });

  const defaultData = useMemo(() => [], []);

  const tableMeta = useMemo(
    () => ({
      allBrands,
      orderQuantities,
      setOrderQuantity: (id, quantity, unit) => {
        setOrderQuantities(prev => {
          const next = { ...prev };
          if (quantity > 0) {
            next[id] = { quantity, unit: unit || next[id]?.unit || 'PIECE' };
          } else {
            delete next[id];
          }
          return next;
        });
      },
      updateData: handleUpdateProduct,
      openDelete: product => {
        setProductToDelete(product);
        setOpenedDelete(true);
      },
      handleOpenStockOp,
    }),
    [orderQuantities, handleUpdateProduct, allBrands, handleOpenStockOp],
  );

  const table = useReactTable({
    data: data || defaultData,
    columns,
    initialState: {
      grouping: ['category'],
      expanded: false,
    },
    meta: tableMeta,
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const totalItemsToOrder = Object.keys(orderQuantities).length;

  return (
    <>
      {isWarehouse && (
        <SendRequestBar
          totalItemsToOrder={totalItemsToOrder}
          isSending={isSending}
          onSend={handleSendOrder}
        />
      )}

      <ProductsGroupedTable table={table} />

      <DeleteProductModal
        opened={openedDelete}
        onClose={() => setOpenedDelete(false)}
        product={productToDelete}
      />

      <StockOperationModal
        stockOpData={stockOpData}
        stockQuantity={stockQuantity}
        onQuantityChange={setStockQuantity}
        onClose={closeStockOp}
        onConfirm={confirmStockOp}
        isLoading={isIncreasing || isDecreasing}
      />
    </>
  );
};

export default ProductsTable;
