import { Badge, Button, Group, Paper, Table, Text } from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useSendOrderMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

import EditableShippedCell from './EditableShippedCell';

const OrderItemsTable = ({ order }) => {
  const { id: orderId, items = [], status, customRequest } = order;

  const userRole = useSelector(userRoleSelector);
  const [sendOrder, { isLoading }] = useSendOrderMutation();

  const hasAccess = userRole === 'ADMIN' || userRole === 'WAREHOUSE';

  const isCompletedOrSent = ['SEND', 'SENT', 'COMPLETE', 'COMPLETED'].includes(
    status?.toUpperCase(),
  );

  const canEditAndSend = hasAccess && !isCompletedOrSent;

  const [shippedQuantities, setShippedQuantities] = useState({});

  useEffect(() => {
    const initial = {};
    items.forEach(item => {
      initial[item.id] =
        item.shippedQty !== null && item.shippedQty !== undefined
          ? item.shippedQty
          : item.requestedQty;
    });
    setShippedQuantities(initial);
  }, [items]);

  const handleUpdateShipped = (itemId, val) => {
    setShippedQuantities(prev => ({ ...prev, [itemId]: val }));
  };

  const columns = useMemo(
    () => [
      {
        accessorFn: row => row.product.name,
        id: 'name',
        header: 'Product Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorFn: row => row.product.category,
        id: 'category',
        header: 'Category',
      },
      {
        accessorKey: 'requestedQty',
        header: 'Requested Quantity',
        cell: info => <Text fw={600}>{info.getValue()}</Text>,
      },
      {
        id: 'shippedQty',
        header: 'Shipped Quantity',
        cell: ({ row }) => {
          const item = row.original;
          const currentVal = shippedQuantities[item.id] ?? item.requestedQty;

          if (!canEditAndSend) {
            return (
              <Text
                c={currentVal < item.requestedQty ? 'orange' : 'green'}
                fw={600}
              >
                {item.shippedQty ?? currentVal}
              </Text>
            );
          }

          return (
            <EditableShippedCell
              initialValue={currentVal}
              onUpdate={val => handleUpdateShipped(item.id, val)}
              disabled={!hasAccess}
            />
          );
        },
      },
    ],
    [canEditAndSend, shippedQuantities, hasAccess],
  );

  const table = useReactTable({
    data: items,
    columns,
    initialState: {
      grouping: ['category'],
      expanded: true,
      sorting: [
        { id: 'category', desc: false },
        { id: 'name', desc: false },
      ],
    },
    getCoreRowModel: getCoreRowModel(),
    getGroupedRowModel: getGroupedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const handleSendOrder = async () => {
    const payloadItems = items.map(item => ({
      productId: item.product.id,
      quantity: shippedQuantities[item.id] ?? item.requestedQty,
    }));

    try {
      await sendOrder({ orderId, items: payloadItems }).unwrap();
      toast.success('Order sent successfully!');
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to send order');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
                {headerGroup.headers.map(header => {
                  if (header.id === 'category') return null;
                  return (
                    <Table.Th key={header.id}>
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
                    return (
                      <Table.Td key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}

            {customRequest &&
              typeof customRequest === 'string' &&
              customRequest.trim() !== '' && (
                <>
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
                          Other
                        </Text>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                  <Table.Tr>
                    <Table.Td colSpan={columns.length - 1}>
                      <Text
                        size="sm"
                        px="md"
                        py="xs"
                        style={{ whiteSpace: 'pre-wrap' }}
                      >
                        {customRequest}
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                </>
              )}
          </Table.Tbody>
        </Table>
      </Paper>

      {canEditAndSend && (
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            color="violet"
            size="md"
            loading={isLoading}
            onClick={handleSendOrder}
          >
            Send order
          </Button>
        </Group>
      )}
    </div>
  );
};

export default OrderItemsTable;
