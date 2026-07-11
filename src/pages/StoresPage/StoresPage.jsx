import {
  ActionIcon,
  Badge,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Pencil, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/ui/DataTable';
import DeleteStoreModal from '../../components/ui/DeleteStoreModal';
import EditStoreModal from '../../components/ui/EditStoreModal';
import { useGetAllStoresQuery } from '../../store/api/api';
import getBrandColor from '../../utils/getBrandColor';

const StoresPage = () => {
  const { t } = useTranslation('stores');
  const { data: stores = [], isLoading } = useGetAllStoresQuery();

  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'brand.name',
        header: t('columns.brand'),
        cell: info => {
          const brandName = info.getValue();
          return brandName ? (
            <Badge
              variant="light"
              size="sm"
              color={getBrandColor(brandName)}
            >
              {brandName}
            </Badge>
          ) : (
            <Text
              size="xs"
              c="dimmed"
            >
              {t('columns.noBrand')}
            </Text>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        cell: info => (
          <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        accessorKey: 'lastOrderAt',
        header: t('columns.lastOrder'),
        cell: info => {
          const value = info.getValue();
          return value ? (
            <Text size="sm">{dayjs(value).format('DD.MM.YY HH:mm')}</Text>
          ) : (
            <Text
              size="xs"
              c="dimmed"
            >
              {t('columns.noOrders')}
            </Text>
          );
        },
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: info => {
          const store = info.row.original;
          return (
            <Group gap="xs">
              <Tooltip label={t('tooltips.edit')}>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => {
                    setSelectedStore(store);
                    openEdit();
                  }}
                >
                  <Pencil size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label={t('tooltips.delete')}>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setSelectedStore(store);
                    openDelete();
                  }}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ],
    [openEdit, openDelete, t],
  );

  return (
    <Container
      size="xl"
      py="xl"
    >
      <Box
        pos="relative"
        minHeight={200}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2 }}
        />
        <Title
          order={2}
          mb={10}
        >
          {t('management')}
        </Title>

        <DataTable
          data={stores}
          columns={columns}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </Box>

      <EditStoreModal
        key={selectedStore?.id}
        opened={openedEdit}
        onClose={closeEdit}
        store={selectedStore}
      />

      <DeleteStoreModal
        opened={openedDelete}
        onClose={closeDelete}
        store={selectedStore}
      />
    </Container>
  );
};

export default StoresPage;
