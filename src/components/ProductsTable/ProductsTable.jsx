import {
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import {
  useCreateWarehouseRequestMutation,
  useDecreaseProductMutation,
  useGetAllBrandsQuery,
  useIncreaseProductMutation,
  useUpdateProductsMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

import { useProductColumns } from './columns';
import DeleteProductModal from './DeleteProductModal';
import ProductsGroupedTable from './ProductsGroupedTable';
import SendRequestBar from './SendRequestBar';
import StockOperationModal from './StockOperationModal';

const ProductsTable = ({ data }) => {
  const { t } = useTranslation(['products', 'warehouse']);
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
        toast.success(t('updated'));
      } catch {
        toast.error(t('updateFailed'));
      }
    },
    [updateProducts, t],
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
      return toast.error(t('warehouse:sendRequestBar.quantityRequired'));
    }

    try {
      await createWarehouseRequest({ items: payloadItems }).unwrap();
      toast.success(t('warehouse:sendRequestBar.requestSent'));
      setOrderQuantities({});
    } catch {
      toast.error(t('warehouse:sendRequestBar.sendFailed'));
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
      toast.success(t(`warehouse:stockModal.${type}Success`));
      closeStockOp();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, `warehouse:stockModal.${type}Failed`));
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
