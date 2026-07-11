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
import DeleteBrandModal from '../../components/ui/DeleteBrandModal';
import EditBrandModal from '../../components/ui/EditBrandModal';
import { useGetAllBrandsQuery } from '../../store/api/api';

const BrandsPage = () => {
  const { t } = useTranslation('brands');
  const { data: brands = [], isLoading } = useGetAllBrandsQuery();
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        id: 'storesCount',
        accessorFn: row => row._count?.stores ?? 0,
        header: t('columns.stores'),
        cell: info => (
          <Badge
            variant="light"
            color="teal"
            size="sm"
          >
            {info.getValue()}
          </Badge>
        ),
      },
      {
        id: 'productsCount',
        accessorFn: row => row._count?.products ?? 0,
        header: t('columns.products'),
        cell: info => (
          <Badge
            variant="light"
            color="blue"
            size="sm"
          >
            {info.getValue()}
          </Badge>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: t('columns.createdAt'),
        cell: info => (
          <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
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
                  setSelectedBrand(info.row.original);
                  openEdit();
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
                  setSelectedBrand(info.row.original);
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
          data={brands}
          columns={columns}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </Box>

      <EditBrandModal
        key={selectedBrand?.id}
        opened={openedEdit}
        onClose={closeEdit}
        brand={selectedBrand}
      />

      <DeleteBrandModal
        opened={openedDelete}
        onClose={closeDelete}
        brand={selectedBrand}
      />
    </Container>
  );
};

export default BrandsPage;
