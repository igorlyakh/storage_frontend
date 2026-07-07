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
import DataTable from '../../components/ui/DataTable';
import DeleteStoreModal from '../../components/ui/DeleteStoreModal';
import EditStoreModal from '../../components/ui/EditStoreModal';
import { useGetAllStoresQuery } from '../../store/api/api';
import getBrandColor from '../../utils/getBrandColor';

const StoresPage = () => {
  const { data: stores = [], isLoading } = useGetAllStoresQuery();

  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedStore, setSelectedStore] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Store Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'brand.name',
        header: 'Brand',
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
              No brand
            </Text>
          );
        },
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: info => (
          <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const store = info.row.original;
          return (
            <Group gap="xs">
              <Tooltip label="Edit Store">
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
              <Tooltip label="Delete Store">
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
    [openEdit, openDelete],
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
          Stores Management
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
