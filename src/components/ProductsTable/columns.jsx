import { ActionIcon, Avatar, Group, NumberInput, Select, Stack, Switch, Text, Tooltip } from '@mantine/core';
import dayjs from 'dayjs';
import { Image as ImageIcon, Minus, Plus, Trash } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import {
  EditableBrandsCell,
  EditableNumberCell,
  EditableSelectCell,
  EditableTextCell,
} from './EditableCells';

export const useProductColumns = ({ isAdmin, isWarehouse }) => {
  const { t } = useTranslation('products');

  return useMemo(() => {
    const cols = [
      {
        accessorKey: 'name',
        header: t('columns.productDetails'),
        size: 300,
        cell: ({ row, table, getValue }) => (
          <Group
            gap="sm"
            wrap="nowrap"
          >
            <Tooltip label={t('card.openTooltip')}>
              <Avatar
                src={row.original.imageUrl}
                radius="sm"
                size={40}
                style={{ cursor: 'pointer', flexShrink: 0 }}
                onClick={() => table.options.meta.openProductCard(row.original)}
              >
                <ImageIcon size={18} />
              </Avatar>
            </Tooltip>
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
          </Group>
        ),
      },
      {
        accessorKey: 'brands',
        header: t('columns.brands'),
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
        accessorFn: row => row.category?.name || t('columns.withoutCategory'),
        header: t('columns.category'),
      },
      {
        accessorKey: 'packageType',
        header: t('columns.pkgType'),
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
        header: t('columns.qtyPerPkg'),
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
        header: t('columns.packages'),
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
        header: t('columns.stockQty'),
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
        header: t('columns.toOrder'),
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

          const unitOptions = [{ value: 'PIECE', label: t('columns.pcsUnit') }];

          if (product.packageType && product.packageType !== 'PIECE') {
            unitOptions.push({
              value: product.packageType,
              label: t(`create.packageTypes.${product.packageType}`, product.packageType),
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
        header: t('columns.available'),
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
        header: t('columns.updated'),
        size: 120,
        cell: ({ getValue }) => (
          <Text size="sm">{dayjs(getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        accessorKey: 'limitPerOrder',
        header: t('columns.limit'),
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
        header: t('columns.delete'),
        size: 60,
        cell: ({ row, table }) => (
          <Tooltip label={t('columns.deleteTooltip')}>
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
  }, [isWarehouse, isAdmin, t]);
};
