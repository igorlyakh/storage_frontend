import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Group,
  Modal,
  NumberInput,
  Paper,
  Stack,
  Switch,
  Table,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { ChevronDown, ChevronRight, Minus, Plus, Trash } from 'lucide-react';
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

import DeleteProductModal from './DeleteProductModal';
import {
  EditableBrandsCell,
  EditableNumberCell,
  EditableOrderCell,
  EditableTextCell,
} from './EditableCells';

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
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
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
    const itemsToOrder = Object.entries(orderQuantities).map(([productId, quantity]) => {
      const product = data.find(p => String(p.id) === String(productId));
      return { product, quantity };
    });

    if (itemsToOrder.length === 0) {
      return toast.error('Please specify quantity for at least one product');
    }

    const payloadItems = itemsToOrder.map(item => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

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

  const columns = useMemo(() => {
    const cols = [
      {
        accessorKey: 'article',
        header: 'Article',
        size: 90,
        cell: ({ row, table, getValue }) => (
          <EditableTextCell
            fw={600}
            c="gray"
            initialValue={getValue()}
            onUpdate={newVal =>
              table.options.meta.updateData(row.original, 'article', newVal)
            }
          />
        ),
      },
      {
        accessorKey: 'name',
        header: 'Product Name',
        size: 140,
        cell: ({ row, table, getValue }) => (
          <EditableTextCell
            fw={700}
            initialValue={getValue()}
            onUpdate={newVal =>
              table.options.meta.updateData(row.original, 'name', newVal)
            }
          />
        ),
      },
      {
        accessorKey: 'brands',
        header: 'Brands',
        size: 180,
        cell: ({ row, table, getValue }) => (
          <EditableBrandsCell
            initialBrands={getValue() || []}
            allBrands={table.options.meta.allBrands}
            onUpdate={newBrandIds =>
              table.options.meta.updateData(row.original, 'brandIds', newBrandIds)
            }
          />
        ),
      },
      {
        id: 'category',
        accessorFn: row => row.category?.name || 'WITHOUT CATEGORY',
        header: 'Category',
      },
      {
        accessorKey: 'packageType',
        header: 'Pkg Type',
        size: 100,
        cell: ({ getValue }) => {
          const val = getValue();
          if (!val)
            return (
              <Text
                c="dimmed"
                size="sm"
              >
                -
              </Text>
            );
          return (
            <Badge
              size="sm"
              variant="light"
              color="indigo"
            >
              {val}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'stock.packageCount',
        header: 'Packages',
        size: 90,
        cell: ({ getValue }) => <Text c="orange.7">{getValue() ?? 0}</Text>,
      },
      {
        accessorKey: 'stock.quantity',
        header: 'Stock (Qty)',
        size: isAdmin ? 140 : 100,
        cell: ({ row, table, getValue }) => {
          const val = getValue() ?? 0;
          const product = row.original;

          return (
            <Group
              gap="xs"
              wrap="nowrap"
            >
              <Text
                c={val < 0 ? 'red' : 'dark'}
                fw={val < 0 ? 700 : 500}
              >
                {val}
              </Text>

              {isAdmin && (
                <Group
                  gap={4}
                  wrap="nowrap"
                >
                  <ActionIcon
                    size="sm"
                    variant="light"
                    color="red"
                    onClick={() =>
                      table.options.meta.handleOpenStockOp(product, 'decrease')
                    }
                  >
                    <Minus size={14} />
                  </ActionIcon>
                  <ActionIcon
                    size="sm"
                    variant="light"
                    color="green"
                    onClick={() =>
                      table.options.meta.handleOpenStockOp(product, 'increase')
                    }
                  >
                    <Plus size={14} />
                  </ActionIcon>
                </Group>
              )}
            </Group>
          );
        },
      },
    ];

    if (isWarehouse) {
      cols.push({
        id: 'orderQuantity',
        header: 'To Order',
        size: 120,
        cell: ({ row, table }) => {
          const product = row.original;
          const val = table.options.meta.orderQuantities[product.id] || null;

          return (
            <EditableOrderCell
              initialValue={val}
              onUpdate={newVal => table.options.meta.setOrderQuantity(product.id, newVal)}
            />
          );
        },
      });
    }

    cols.push(
      {
        accessorKey: 'isEnabled',
        header: 'Available',
        size: 100,
        cell: ({ row, table, getValue }) => (
          <Switch
            checked={getValue()}
            onChange={e =>
              table.options.meta.updateData(
                row.original,
                'isEnabled',
                e.currentTarget.checked,
              )
            }
            color="green"
            size="sm"
          />
        ),
      },
      {
        accessorKey: 'updatedAt',
        header: 'Updated',
        size: 140,
        cell: ({ getValue }) => (
          <Text size="sm">{dayjs(getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        accessorKey: 'limitPerOrder',
        header: 'Limit',
        size: 100,
        cell: ({ row, table, getValue }) => (
          <EditableNumberCell
            initialValue={getValue()}
            onUpdate={newVal =>
              table.options.meta.updateData(row.original, 'limitPerOrder', newVal)
            }
          />
        ),
      },
      {
        id: 'actions',
        header: 'Delete',
        size: 80,
        cell: ({ row, table }) => (
          <Tooltip label="Delete Product">
            <ActionIcon
              color="red"
              variant="light"
              onClick={() => table.options.meta.openDelete(row.original)}
            >
              <Trash size={16} />
            </ActionIcon>
          </Tooltip>
        ),
      },
    );

    return cols;
  }, [isWarehouse, isAdmin]);

  const defaultData = useMemo(() => [], []);

  const tableMeta = useMemo(
    () => ({
      allBrands,
      orderQuantities,
      setOrderQuantity: (id, val) => {
        setOrderQuantities(prev => {
          const next = { ...prev };
          if (val > 0) next[id] = val;
          else delete next[id];
          return next;
        });
      },
      updateData: handleUpdateProduct,
      openDelete: product => {
        setProductToDelete(product);
        openDelete();
      },
      handleOpenStockOp,
    }),
    [orderQuantities, handleUpdateProduct, openDelete, allBrands, handleOpenStockOp],
  );

  const table = useReactTable({
    data: data || defaultData,
    columns,
    initialState: {
      grouping: ['category'],
      expanded: false,
      sorting: [
        { id: 'category', desc: false },
        { id: 'name', desc: false },
      ],
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
        <Group
          justify="space-between"
          mb="md"
          align="center"
          gap="sm"
        >
          <Box w={{ base: '100%', sm: 'auto' }}>
            {totalItemsToOrder > 0 && (
              <Badge
                color="green"
                size="lg"
                variant="light"
                w={{ base: '100%', sm: 'auto' }}
              >
                Selected products: {totalItemsToOrder}
              </Badge>
            )}
          </Box>
          <Button
            onClick={handleSendOrder}
            disabled={isSending || totalItemsToOrder === 0}
            color={totalItemsToOrder > 0 ? 'green' : 'gray'}
            loading={isSending}
            w={{ base: '100%', sm: 'auto' }}
          >
            Send Request
          </Button>
        </Group>
      )}

      <Paper
        withBorder
        radius="md"
        overflow="hidden"
      >
        <Table.ScrollContainer minWidth={1050}>
          <Table
            verticalSpacing="sm"
            highlightOnHover
            layout="fixed"
          >
            <Table.Thead bg="gray.0">
              {table.getHeaderGroups().map(headerGroup => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    if (header.id === 'category') return null;
                    const isNameCol = header.id === 'name';

                    return (
                      <Table.Th
                        key={header.id}
                        style={{
                          width: isNameCol ? '100%' : header.getSize(),
                          minWidth: isNameCol ? 250 : header.getSize(),
                          ...(isNameCol
                            ? {
                                position: 'sticky',
                                left: 0,
                                zIndex: 2,
                                backgroundColor: 'var(--mantine-color-gray-0)',
                                boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                              }
                            : undefined),
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </Table.Th>
                    );
                  })}
                </Table.Tr>
              ))}
            </Table.Thead>

            <Table.Tbody>
              {table.getRowModel().rows.map(row => {
                if (row.getIsGrouped()) {
                  return (
                    <Table.Tr
                      key={row.id}
                      bg="blue.0"
                    >
                      <Table.Td colSpan={row.getVisibleCells().length}>
                        <Group
                          gap="xs"
                          onClick={row.getToggleExpandedHandler()}
                          style={{ cursor: 'pointer', userSelect: 'none' }}
                        >
                          {row.getIsExpanded() ? (
                            <ChevronDown size={18} />
                          ) : (
                            <ChevronRight size={18} />
                          )}
                          <Text
                            fw={700}
                            size="md"
                            c="blue.9"
                          >
                            {row.groupingValue}
                          </Text>
                          <Badge
                            color="blue"
                            variant="filled"
                            size="sm"
                            circle
                          >
                            {row.subRows.length}
                          </Badge>
                        </Group>
                      </Table.Td>
                    </Table.Tr>
                  );
                }

                return (
                  <Table.Tr key={row.id}>
                    {row.getVisibleCells().map(cell => {
                      if (cell.column.id === 'category') return null;
                      const isNameCol = cell.column.id === 'name';

                      return (
                        <Table.Td
                          key={cell.id}
                          style={
                            isNameCol
                              ? {
                                  position: 'sticky',
                                  left: 0,
                                  zIndex: 1,
                                  backgroundColor: 'var(--mantine-color-body)',
                                  boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                                }
                              : undefined
                          }
                        >
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </Table.Td>
                      );
                    })}
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

      <DeleteProductModal
        opened={openedDelete}
        onClose={closeDelete}
        product={productToDelete}
      />

      <Modal
        opened={!!stockOpData}
        onClose={closeStockOp}
        title={
          stockOpData
            ? `${stockOpData.type === 'increase' ? 'Increase' : 'Decrease'} Stock: ${stockOpData.product?.name}`
            : ''
        }
        centered
      >
        <Stack>
          <NumberInput
            label="Quantity"
            value={stockQuantity}
            onChange={val => setStockQuantity(val || 0)}
            min={1}
            data-autofocus
          />
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={closeStockOp}
            >
              Cancel
            </Button>
            <Button
              color={stockOpData?.type === 'increase' ? 'green' : 'red'}
              onClick={confirmStockOp}
              loading={isIncreasing || isDecreasing}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
};

export default ProductsTable;
