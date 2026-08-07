import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Text,
  TextInput,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import DeleteWarehouseModal from '../../components/ui/DeleteWarehouseModal';
import EditWarehouseModal from '../../components/ui/EditWarehouseModal';
import {
  useCreateWarehouseMutation,
  useGetAllWarehousesQuery,
} from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const WarehousesPage = () => {
  const { t } = useTranslation('warehouse');
  const { data: warehouses = [], isLoading } = useGetAllWarehousesQuery();
  const [createWarehouse, { isLoading: isCreating }] = useCreateWarehouseMutation();

  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [newName, setNewName] = useState('');

  const handleCreate = async () => {
    const name = newName.trim();
    if (!name) {
      return toast.error(t('management.nameRequired'));
    }
    try {
      await createWarehouse({ name }).unwrap();
      toast.success(t('management.created'));
      setNewName('');
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'management.createFailed'));
    }
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('management.columns.name'),
        cell: info => (
          <Group
            gap="xs"
            wrap="nowrap"
          >
            <Anchor
              component={Link}
              to={`/warehouses/${info.row.original.id}`}
              fw={500}
            >
              {info.getValue()}
            </Anchor>
            {info.row.original.isDefault && (
              <Badge
                color="blue"
                variant="light"
                size="sm"
              >
                {t('management.defaultBadge')}
              </Badge>
            )}
          </Group>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('management.columns.createdAt'),
        cell: info => (
          <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
      {
        id: 'actions',
        header: t('management.columns.actions'),
        cell: info => (
          <Group gap="xs">
            <Tooltip label={t('management.tooltips.edit')}>
              <ActionIcon
                color="blue"
                variant="light"
                onClick={() => {
                  setSelectedWarehouse(info.row.original);
                  openEdit();
                }}
              >
                <Pencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip
              label={
                info.row.original.isDefault
                  ? t('management.tooltips.deleteDisabled')
                  : t('management.tooltips.delete')
              }
            >
              <ActionIcon
                color="red"
                variant="light"
                disabled={info.row.original.isDefault}
                style={{ pointerEvents: 'all' }}
                onClick={() => {
                  if (info.row.original.isDefault) return;
                  setSelectedWarehouse(info.row.original);
                  openDelete();
                }}
              >
                <Trash size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        ),
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
        mih={200}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2 }}
        />

        <Title
          order={2}
          mb={10}
        >
          {t('management.pageTitle')}
        </Title>

        <Group
          mb="md"
          align="flex-end"
          gap="sm"
        >
          <TextInput
            placeholder={t('management.createPlaceholder')}
            value={newName}
            onChange={e => setNewName(e.currentTarget.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreate()}
            w={{ base: '100%', sm: 280 }}
          />
          <Button
            leftSection={<Plus size={16} />}
            onClick={handleCreate}
            loading={isCreating}
            w={{ base: '100%', sm: 'auto' }}
          >
            {t('management.create')}
          </Button>
        </Group>

        <DataTable
          data={warehouses}
          columns={columns}
        />
      </Box>

      <EditWarehouseModal
        key={selectedWarehouse?.id}
        opened={openedEdit}
        onClose={closeEdit}
        warehouse={selectedWarehouse}
      />

      <DeleteWarehouseModal
        opened={openedDelete}
        onClose={closeDelete}
        warehouse={selectedWarehouse}
      />
    </Container>
  );
};

export default WarehousesPage;
