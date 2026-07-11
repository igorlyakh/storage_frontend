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
import DeleteCategoryModal from '../../components/ui/DeleteCategoryModal';
import EditCategoryModal from '../../components/ui/EditCategoryModal';
import { useGetAllCategoriesQuery } from '../../store/api/api';

const CategoriesPage = () => {
  const { t } = useTranslation('categories');
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('columns.name'),
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
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
                  setSelectedCategory(info.row.original);
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
                  setSelectedCategory(info.row.original);
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
          data={categories}
          columns={columns}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </Box>

      <EditCategoryModal
        key={selectedCategory?.id}
        opened={openedEdit}
        onClose={closeEdit}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        opened={openedDelete}
        onClose={closeDelete}
        category={selectedCategory}
      />
    </Container>
  );
};

export default CategoriesPage;
