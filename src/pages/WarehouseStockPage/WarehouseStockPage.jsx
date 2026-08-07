import {
  Anchor,
  Avatar,
  Badge,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Title,
} from '@mantine/core';
import { ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { EditableNumberCell } from '../../components/ProductsTable/EditableCells';
import DataTable from '../../components/ui/DataTable';
import {
  useGetWarehouseStocksQuery,
  useSetProductStockMutation,
} from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const WarehouseStockPage = () => {
  const { t } = useTranslation('warehouse');
  const { id } = useParams();
  const { data, isLoading } = useGetWarehouseStocksQuery(id);
  const [setProductStock] = useSetProductStockMutation();

  const warehouse = data?.warehouse;
  const products = data?.products || [];

  const handleSetQuantity = useCallback(
    async (productId, newValue) => {
      try {
        await setProductStock({
          id: productId,
          quantity: Number(newValue) || 0,
          warehouseId: id,
        }).unwrap();
        toast.success(t('stockPage.updated'));
      } catch (error) {
        toast.error(getApiErrorMessage(t, error, 'stockPage.updateFailed'));
      }
    },
    [setProductStock, id, t],
  );

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('stockPage.columns.product'),
        cell: info => (
          <Group
            gap="sm"
            wrap="nowrap"
          >
            <Avatar
              src={info.row.original.imageUrl}
              radius="sm"
              size={36}
            >
              <ImageIcon size={16} />
            </Avatar>
            <div>
              <Text fw={600}>{info.getValue()}</Text>
              <Text
                size="xs"
                c="dimmed"
              >
                {info.row.original.article}
              </Text>
            </div>
          </Group>
        ),
      },
      {
        id: 'category',
        accessorFn: row => row.category?.name || '',
        header: t('stockPage.columns.category'),
        cell: info =>
          info.getValue() ? <Badge variant="outline">{info.getValue()}</Badge> : null,
      },
      {
        accessorKey: 'packageCount',
        header: t('stockPage.columns.packages'),
        cell: info => (
          <Text
            fw={600}
            c="orange.7"
          >
            {info.getValue()}
          </Text>
        ),
      },
      {
        accessorKey: 'quantity',
        header: t('stockPage.columns.quantity'),
        cell: info => (
          <Box maw={100}>
            <EditableNumberCell
              initialValue={info.getValue()}
              allowZero={true}
              onUpdate={newVal => handleSetQuantity(info.row.original.id, newVal)}
            />
          </Box>
        ),
      },
    ],
    [t, handleSetQuantity],
  );

  return (
    <Container
      size="xl"
      py="xl"
    >
      <Box
        pos="relative"
        mih={200}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2 }}
        />

        <Anchor
          component={Link}
          to="/warehouses"
          size="sm"
        >
          <Group gap={4}>
            <ArrowLeft size={14} />
            {t('stockPage.back')}
          </Group>
        </Anchor>

        <Group
          gap="sm"
          mt={4}
          mb={4}
        >
          <Title order={2}>{t('stockPage.title', { name: warehouse?.name || '' })}</Title>
          {warehouse?.isDefault && (
            <Badge
              color="blue"
              variant="light"
            >
              {t('management.defaultBadge')}
            </Badge>
          )}
        </Group>

        <Text
          size="sm"
          c="dimmed"
          mb="md"
        >
          {t('stockPage.hint')}
        </Text>

        <DataTable
          data={products}
          columns={columns}
        />
      </Box>
    </Container>
  );
};

export default WarehouseStockPage;
