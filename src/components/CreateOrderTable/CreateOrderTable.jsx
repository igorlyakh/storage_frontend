import {
  Badge,
  Box,
  Button,
  Group,
  LoadingOverlay,
  NumberInput,
  Paper,
  Select,
  Table,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, User } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  api,
  useCreateOrderMutation,
  useGetAllProductsByBrandQuery,
  useGetAllProductsQuery,
  useGetAllStoresQuery,
} from '../../store/api/api';
import { ConfirmOrderModal } from '../ui/ConfirmationModal/ConfirmationModal';

const CreateOrderTable = ({ writeOff = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const productsQueryName = writeOff ? 'getAllProducts' : 'getAllProductsByBrand';

  const { data: byBrandProducts = [], isFetching: isByBrandLoading } =
    useGetAllProductsByBrandQuery(undefined, { skip: writeOff });
  const { data: allProducts = [], isFetching: isAllLoading } = useGetAllProductsQuery(
    undefined,
    { skip: !writeOff },
  );

  const products = writeOff ? allProducts : byBrandProducts;
  const isProductsLoading = writeOff ? isAllLoading : isByBrandLoading;

  const { data: stores = [], isLoading: isStoresLoading } = useGetAllStoresQuery(
    undefined,
    { skip: !writeOff },
  );

  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const [name, setName] = useState('');
  const [customRequest, setCustomRequest] = useState('');
  const [storeId, setStoreId] = useState(null);

  const rowData = useMemo(() => products.filter(p => p.isEnabled), [products]);

  const storeOptions = stores.map(store => ({
    value: String(store.id),
    label: store.name,
  }));

  const handleQuantityChange = useCallback(
    (productId, val) => {
      dispatch(
        api.util.updateQueryData(productsQueryName, undefined, draft => {
          const product = draft.find(p => p.id === productId);
          if (product) {
            if (val === '' || val === undefined || val === null) {
              product.orderQuantity = undefined;
            } else {
              let newValue = Number(val);

              if (newValue === 0 && product.orderQuantity === undefined) {
                newValue = 1;
              }

              product.orderQuantity = newValue;
            }
          }
        }),
      );
    },
    [dispatch, productsQueryName],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: info => (
          <Text
            fw={700}
            fz={{ base: 14, sm: 18 }}
          >
            {info.getValue()}
          </Text>
        ),
      },
      {
        id: 'category',
        accessorFn: row => row.category?.name,
        header: 'Category',
      },
      {
        accessorKey: 'orderQuantity',
        header: 'Quantity to Order',
        cell: info => {
          const row = info.row.original;
          return (
            <NumberInput
              value={row.orderQuantity ?? ''}
              onChange={val => handleQuantityChange(row.id, val)}
              min={0}
              max={!writeOff && row.limitPerOrder ? row.limitPerOrder : undefined}
              placeholder="0"
              allowNegative={false}
              allowDecimal={false}
              w={{ base: 100, sm: 120 }}
            />
          );
        },
      },
      {
        accessorKey: 'limitPerOrder',
        header: 'Limit',
        cell: info => {
          if (writeOff) {
            return (
              <Text
                c="dimmed"
                size="sm"
              >
                No limit
              </Text>
            );
          }

          const limit = info.getValue();
          return limit ? (
            <Badge
              color="gray"
              variant="light"
            >
              Max {limit}
            </Badge>
          ) : (
            <Text
              c="dimmed"
              size="sm"
            >
              No limit
            </Text>
          );
        },
      },
    ],
    [handleQuantityChange, writeOff],
  );

  const table = useReactTable({
    data: rowData,
    columns,
    initialState: {
      grouping: ['category'],
      expanded: false,
    },
    autoResetExpanded: false,
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const submitOrder = async itemsToOrder => {
    modals.closeAll();

    const payloadItems = itemsToOrder.map(p => ({
      name: p.name,
      quantity: p.orderQuantity,
    }));

    const payload = {
      name: name.trim(),
      items: payloadItems,
      ...(customRequest.trim() && { customRequest: customRequest.trim() }),
      ...(writeOff && { storeId: Number(storeId) }),
    };

    try {
      await createOrder(payload).unwrap();

      modals.open({
        title: 'Order Status',
        centered: true,
        withCloseButton: false,
        closeOnClickOutside: false,
        children: (
          <>
            <Text
              size="sm"
              mb="md"
            >
              {writeOff
                ? 'Write-off order has been created successfully.'
                : 'Your order has been sent successfully! The warehouse has been notified.'}
            </Text>
            <Button
              fullWidth
              onClick={() => {
                modals.closeAll();
                navigate(writeOff ? '/all-orders' : '/orders', { replace: true });
              }}
              color="green"
            >
              Understood
            </Button>
          </>
        ),
      });

      setName('');
      setCustomRequest('');
      setStoreId(null);

      dispatch(
        api.util.updateQueryData(productsQueryName, undefined, draft => {
          draft.forEach(p => {
            delete p.orderQuantity;
          });
        }),
      );
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create order');
    }
  };

  const handleSendOrder = () => {
    if (!name.trim()) {
      return toast.error('Please enter your name');
    }

    if (writeOff && !storeId) {
      return toast.error('Please select a store');
    }

    if (writeOff && !customRequest.trim()) {
      return toast.error('Please specify a reason for the write-off');
    }

    const itemsToOrder = rowData.filter(p => p.orderQuantity > 0);

    if (itemsToOrder.length === 0 && !customRequest.trim()) {
      return toast.error('Please specify quantity or write a custom request');
    }

    if (!writeOff) {
      for (const item of itemsToOrder) {
        if (item.limitPerOrder !== null && item.orderQuantity > item.limitPerOrder) {
          return toast.error(
            `Limit exceeded for "${item.name}". Maximum allowed is ${item.limitPerOrder}.`,
          );
        }
      }
    }

    modals.open({
      centered: true,
      closeOnClickOutside: false,
      withCloseButton: false,
      size: 'lg',
      children: (
        <ConfirmOrderModal
          itemsToOrder={itemsToOrder}
          customRequest={customRequest}
          onConfirm={() => submitOrder(itemsToOrder)}
          onCancel={() => modals.closeAll()}
        />
      ),
    });
  };

  return (
    <div style={{ width: '100%', marginTop: 20 }}>
      <Group
        align="flex-end"
        mb="lg"
        grow
      >
        <TextInput
          label="Your Name / Responsible Person"
          placeholder="Enter your name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          required
          leftSection={<User size={16} />}
        />

        {writeOff && (
          <Select
            label="Store"
            placeholder={isStoresLoading ? 'Loading...' : 'Select store'}
            data={storeOptions}
            value={storeId}
            onChange={setStoreId}
            searchable
            required
            disabled={isStoresLoading}
          />
        )}
      </Group>

      <Box
        pos="relative"
        minHeight={200}
      >
        <LoadingOverlay
          visible={isProductsLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />

        <Paper
          withBorder
          radius="lg"
          overflow="hidden"
          shadow="xs"
        >
          <Table.ScrollContainer minWidth={600}>
            <Table
              verticalSpacing="sm"
              highlightOnHover
            >
              <Table.Thead>
                {table.getHeaderGroups().map(headerGroup => (
                  <Table.Tr key={headerGroup.id}>
                    {headerGroup.headers.map(header => {
                      if (header.id === 'category') return null;
                      return (
                        <Table.Th
                          key={header.id}
                          style={{
                            backgroundColor: 'var(--mantine-color-gray-0)',
                            borderBottom: '1px solid var(--mantine-color-gray-3)',
                            textTransform: 'uppercase',
                            fontSize: 11,
                            letterSpacing: 0.5,
                            color: 'var(--mantine-color-gray-6)',
                            fontWeight: 700,
                          }}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
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
                        <Table.Td colSpan={columns.length - 1}>
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

                  const isSelected = row.original.orderQuantity > 0;

                  return (
                    <Table.Tr
                      key={row.id}
                      bg={isSelected ? 'green.0' : undefined}
                    >
                      {row.getVisibleCells().map(cell => {
                        if (cell.column.id === 'category') return null;
                        return (
                          <Table.Td key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </Table.Td>
                        );
                      })}
                    </Table.Tr>
                  );
                })}

                <Table.Tr bg="blue.0">
                  <Table.Td colSpan={columns.length - 1}>
                    <Group
                      gap="xs"
                      style={{ userSelect: 'none' }}
                    >
                      <ChevronDown
                        size={18}
                        color="transparent"
                      />{' '}
                      <Text
                        fw={700}
                        size="md"
                        c="blue.9"
                      >
                        {writeOff ? 'Reason' : 'Other'}
                      </Text>
                    </Group>
                  </Table.Td>
                </Table.Tr>
                <Table.Tr>
                  <Table.Td colSpan={columns.length - 1}>
                    <Textarea
                      placeholder={
                        writeOff
                          ? 'Describe the reason for this write-off (required)...'
                          : "Didn't find what you need? Describe it here..."
                      }
                      value={customRequest}
                      onChange={e => setCustomRequest(e.currentTarget.value)}
                      autosize
                      minRows={2}
                      variant="unstyled"
                      px="md"
                      styles={{
                        input: { borderBottom: '1px dashed var(--mantine-color-gray-4)' },
                      }}
                    />
                  </Table.Td>
                </Table.Tr>
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        </Paper>
      </Box>

      <Group
        justify="flex-end"
        mt="md"
      >
        <Button
          color="blue"
          size="md"
          loading={isLoading}
          onClick={handleSendOrder}
          w={{ base: '100%', sm: 'auto' }}
        >
          {writeOff ? 'Create Write-off' : 'Send Order'}
        </Button>
      </Group>
    </div>
  );
};

export default CreateOrderTable;
