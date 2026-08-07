import { Badge, Button, Checkbox, Group, Paper, Table, Text } from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getGroupedRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ChevronDown, ChevronRight, Send } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSendOrderMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

import EditableShippedCell from './EditableShippedCell';

const OrderItemsTable = ({ order }) => {
  const { t } = useTranslation('orders');
  const { id: orderId, items = [], status, customRequest } = order;

  const userRole = useSelector(userRoleSelector);
  const [sendOrder, { isLoading }] = useSendOrderMutation();

  const hasAccess = userRole === 'ADMIN' || userRole === 'WAREHOUSE';

  const isCompletedOrSent = ['SEND', 'SENT', 'COMPLETE', 'COMPLETED', 'REJECTED'].includes(
    status?.toUpperCase(),
  );

  const canEditAndSend = hasAccess && !isCompletedOrSent;

  const [shippedQuantities, setShippedQuantities] = useState({});
  const [checkedItems, setCheckedItems] = useState({});

  useEffect(() => {
    const initialQty = {};
    const initialChecked = {};

    items.forEach(item => {
      initialQty[item.id] =
        item.shippedQty !== null && item.shippedQty !== undefined
          ? item.shippedQty
          : item.requestedQty;

      initialChecked[item.id] = false;
    });

    setShippedQuantities(initialQty);
    setCheckedItems(initialChecked);
  }, [items]);

  const handleUpdateShipped = (itemId, val) => {
    setShippedQuantities(prev => ({ ...prev, [itemId]: val }));
  };

  const handleUpdateChecked = (itemId, val) => {
    setCheckedItems(prev => ({ ...prev, [itemId]: val }));
  };

  const columns = useMemo(() => {
    const baseColumns = [
      {
        accessorFn: row => row.product.name,
        id: 'name',
        header: t('table.productName'),
        cell: info => {
          const item = info.row.original;
          const isChecked = checkedItems[item.id] ?? false;

          return (
            <Text
              fz={{ base: 14, sm: 16 }}
              fw={700}
              c={canEditAndSend && isChecked ? 'green.9' : undefined}
            >
              {info.getValue()}
            </Text>
          );
        },
      },
      {
        id: 'category',
        accessorFn: row => row.product.category?.name || t('table.withoutCategory'),
        header: t('table.category'),
      },
      {
        accessorKey: 'requestedQty',
        header: t('table.requestedQuantity'),
        cell: info => <Text fw={600}>{info.getValue()}</Text>,
      },
      {
        id: 'shippedQty',
        header: t('table.shippedQuantity'),
        cell: ({ row }) => {
          const item = row.original;
          const currentVal = shippedQuantities[item.id] ?? item.requestedQty;
          const isChecked = checkedItems[item.id] ?? false;

          if (!canEditAndSend) {
            if (item.shippedQty === null || item.shippedQty === undefined) {
              return null;
            }
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
              disabled={!hasAccess || !isChecked}
            />
          );
        },
      },
    ];

    if (canEditAndSend) {
      baseColumns.unshift({
        id: 'select',
        header: t('table.picked'),
        cell: ({ row }) => {
          const item = row.original;
          return (
            <Checkbox
              color="green"
              checked={checkedItems[item.id] || false}
              onChange={e => handleUpdateChecked(item.id, e.currentTarget.checked)}
              disabled={!hasAccess}
            />
          );
        },
      });
    }

    return baseColumns;
  }, [canEditAndSend, shippedQuantities, checkedItems, hasAccess, t]);

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
      isChecked: checkedItems[item.id] ?? false,
    }));

    try {
      await sendOrder({ orderId, items: payloadItems }).unwrap();
      toast.success(t('table.orderSent'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'table.sendFailed'));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                const item = row.original;
                const isChecked = checkedItems[item.id] ?? false;

                return (
                  <Table.Tr
                    key={row.id}
                    style={{
                      backgroundColor:
                        canEditAndSend && isChecked
                          ? 'var(--mantine-color-green-0)'
                          : undefined,
                      transition: 'background-color 0.2s ease',
                    }}
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
                            {t('table.other')}
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
        </Table.ScrollContainer>
      </Paper>

      {canEditAndSend && (
        <Group
          justify="flex-end"
          mt="md"
        >
          <Button
            variant="gradient"
            gradient={{ from: 'violet', to: 'indigo', deg: 90 }}
            radius="md"
            size="md"
            loading={isLoading}
            onClick={handleSendOrder}
            leftSection={<Send size={18} />}
            w={{ base: '100%', sm: 'auto' }}
            style={{ boxShadow: 'var(--mantine-shadow-sm)' }}
          >
            {t('table.sendOrder')}
          </Button>
        </Group>
      )}
    </div>
  );
};

export default OrderItemsTable;
