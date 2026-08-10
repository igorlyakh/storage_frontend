import {
  ActionIcon,
  Box,
  Button,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Pencil, Plus, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/ui/DataTable';
import DeleteSupplierModal from '../../components/ui/DeleteSupplierModal';
import SupplierFormModal from '../../components/ui/SupplierFormModal';
import { useGetAllSuppliersQuery } from '../../store/api/api';

const SuppliersPage = () => {
  const { t } = useTranslation('suppliers');
  const { data: suppliers = [], isLoading } = useGetAllSuppliersQuery();

  const [openedForm, { open: openForm, close: closeForm }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'contactPerson',
        header: t('columns.contactPerson'),
      },
      {
        accessorKey: 'email',
        header: t('columns.email'),
      },
      {
        accessorKey: 'notes',
        header: t('columns.notes'),
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: info => (
          <Group gap="xs">
            <Tooltip label={t('tooltips.edit')}>
              <ActionIcon
                color="blue"
                variant="light"
                onClick={() => {
                  setSelectedSupplier(info.row.original);
                  openForm();
                }}
              >
                <Pencil size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label={t('tooltips.delete')}>
              <ActionIcon
                color="red"
                variant="light"
                onClick={() => {
                  setSelectedSupplier(info.row.original);
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
    [openForm, openDelete, t],
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

        <Group
          justify="space-between"
          mb="md"
        >
          <Title order={2}>{t('pageTitle')}</Title>
          <Button
            leftSection={<Plus size={16} />}
            onClick={() => {
              setSelectedSupplier(null);
              openForm();
            }}
          >
            {t('create')}
          </Button>
        </Group>

        <DataTable
          data={suppliers}
          columns={columns}
        />
      </Box>

      <SupplierFormModal
        key={selectedSupplier?.id || 'create'}
        opened={openedForm}
        onClose={closeForm}
        supplier={selectedSupplier}
      />

      <DeleteSupplierModal
        opened={openedDelete}
        onClose={closeDelete}
        supplier={selectedSupplier}
      />
    </Container>
  );
};

export default SuppliersPage;
