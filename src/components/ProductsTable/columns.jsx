import { ActionIcon, Group, NumberInput, Select, Stack, Switch, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { Minus, Plus, Trash } from 'lucide-react';
import { useMemo } from 'react';

import {
  EditableBrandsCell,
  EditableNumberCell,
  EditableSelectCell,
  EditableTextCell,
} from './EditableCells';

export const useProductColumns = ({ isAdmin, isWarehouse }) => {
  return useMemo(() => {
    const cols = [
      {
        accessorKey: 'name',
        header: 'Product Details',
        size: 300,
        cell: ({ row, table, getValue }) => (
          <Stack
            gap={0}
            py={6}
          >
            <EditableTextCell
              fw={700}
              initialValue={getValue()}
              onUpdate={newVal =>
                table.options.meta.updateData(row.original, 'name', newVal)
              }
            />
            <EditableTextCell
              fz={12}
              fw={500}
              c="dimmed"
              initialValue={row.original.article}
              onUpdate={newVal =>
                table.options.meta.updateData(row.original, 'article', newVal)
              }
            />
          </Stack>
        ),
      },
      {
        accessorKey: 'brands',
        header: 'Brands',
        size: 140,
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
        cell: ({ row, table, getValue }) => (
          <EditableSelectCell
            initialValue={getValue() || 'PIECE'}
            options={[
              { value: 'PALLET', label: 'PALLET' },
              { value: 'BOX', label: 'BOX' },
              { value: 'PACKAGE', label: 'PACKAGE' },
              { value: 'PIECE', label: 'PIECE' },
            ]}
            onUpdate={newVal =>
              table.options.meta.updateData(row.original, 'packageType', newVal)
            }
          />
        ),
      },
      {
        accessorKey: 'itemsPerPackage',
        header: 'Qty/Pkg',
        size: 70,
        cell: ({ row, table, getValue }) => (
          <EditableNumberCell
            initialValue={getValue() ?? 0}
            allowZero={true}
            onUpdate={newVal =>
              table.options.meta.updateData(row.original, 'itemsPerPackage', newVal)
            }
          />
        ),
      },
      {
        accessorKey: 'stock.packageCount',
        header: 'Packages',
        size: 80,
        cell: ({ getValue }) => (
          <Text
            fw={600}
            c="orange.7"
          >
            {getValue() ?? 0}
          </Text>
        ),
      },
      {
        accessorKey: 'stock.quantity',
        header: 'Stock (Qty)',
        size: isAdmin ? 130 : 90,
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
        size: 160,
        cell: ({ row, table }) => {
          const product = row.original;

          const defaultUnit =
            product.packageType && product.packageType !== 'PIECE'
              ? product.packageType
              : 'PIECE';

          const orderData = table.options.meta.orderQuantities[product.id] || {
            quantity: '',
            unit: defaultUnit,
          };

          const unitOptions = [{ value: 'PIECE', label: 'pcs' }];

          if (product.packageType && product.packageType !== 'PIECE') {
            unitOptions.push({
              value: product.packageType,
              label: product.packageType.toLowerCase() + 's',
            });
          }

          return (
            <Group
              gap={4}
              wrap="nowrap"
            >
              <NumberInput
                value={orderData.quantity}
                onChange={val =>
                  table.options.meta.setOrderQuantity(product.id, val, orderData.unit)
                }
                min={0}
                hideControls
                placeholder="0"
                w={60}
                size="sm"
                styles={{
                  input: {
                    backgroundColor:
                      orderData.quantity > 0 ? 'var(--mantine-color-green-0)' : undefined,
                    fontWeight: orderData.quantity > 0 ? 'bold' : 'normal',
                  },
                }}
              />
              <Select
                data={unitOptions}
                value={orderData.unit}
                onChange={newUnit =>
                  table.options.meta.setOrderQuantity(
                    product.id,
                    orderData.quantity || null,
                    newUnit,
                  )
                }
                w={80}
                size="sm"
                allowDeselect={false}
              />
            </Group>
          );
        },
      });
    }

    cols.push(
      {
        accessorKey: 'isEnabled',
        header: 'Available',
        size: 90,
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
        size: 120,
        cell: ({ getValue }) => (
          <Text size="sm">{dayjs(getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        accessorKey: 'limitPerOrder',
        header: 'Limit',
        size: 80,
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
        size: 60,
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
};
