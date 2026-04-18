import { Badge, Button, Group, NumberInput, Paper, Table, Text } from '@mantine/core';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';

import { api, useCreateOrderMutation, useGetAllProductsQuery } from '../../store/api/api';

const CreateOrderTable = () => {
  const dispatch = useDispatch();

  const { data: products = [] } = useGetAllProductsQuery();
  const [createOrder, { isLoading }] = useCreateOrderMutation();

  const rowData = useMemo(() => products.filter(p => p.isEnabled), [products]);

  const handleQuantityChange = useCallback(
    (productId, val) => {
      const newValue = Number(val) || 0;

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

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Product Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'limitPerOrder',
        header: 'Limit',
        cell: info => {
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
      {
        accessorKey: 'orderQuantity',
        header: 'Quantity to Order',
        cell: info => {
          const row = info.row.original;
          return (
            <NumberInput
              value={row.orderQuantity || ''}
              onChange={val => handleQuantityChange(row.id, val)}
              min={0}
              max={row.limitPerOrder || undefined}
              placeholder="0"
              allowNegative={false}
              allowDecimal={false}
              w={120}
            />
          );
        },
      },
    ],
    [handleQuantityChange],
  );

  const table = useReactTable({
    data: rowData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleSendOrder = async () => {
    const itemsToOrder = rowData.filter(p => p.orderQuantity > 0);

    if (itemsToOrder.length === 0) {
      return toast.error('Please specify quantity for at least one product');
    }

    for (const item of itemsToOrder) {
      if (item.limitPerOrder !== null && item.orderQuantity > item.limitPerOrder) {
        return toast.error(
          `Limit exceeded for "${item.name}". Maximum allowed is ${item.limitPerOrder}.`,
        );
      }
    }

    const payloadItems = itemsToOrder.map(p => ({
      name: p.name,
      quantity: p.orderQuantity,
    }));

    try {
      await createOrder({ items: payloadItems }).unwrap();
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
      <Paper
        withBorder
        radius="md"
        overflow="hidden"
        shadow="sm"
      >
        <Table
          verticalSpacing="sm"
          highlightOnHover
        >
          <Table.Thead bg="gray.0">
            {table.getHeaderGroups().map(headerGroup => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.Th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {table.getRowModel().rows.map(row => {
              const isSelected = row.original.orderQuantity > 0;

              return (
                <Table.Tr
                  key={row.id}
                  bg={isSelected ? 'green.0' : undefined}
                >
                  {row.getVisibleCells().map(cell => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Paper>

      <Group
        justify="flex-end"
        mt="md"
      >
        <Button
          color="blue"
          size="md"
          loading={isLoading}
          onClick={handleSendOrder}
        >
          Confirm Order
        </Button>
      </Group>
    </div>
  );
};

export default CreateOrderTable;
