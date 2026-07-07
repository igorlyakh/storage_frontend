import {
  ActionIcon,
  Box,
  Container,
  LoadingOverlay,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { Pencil } from 'lucide-react';
import { useMemo, useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import EditCategoryModal from '../../components/ui/EditCategoryModal';
import { useGetAllCategoriesQuery } from '../../store/api/api';

const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();
  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Category Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
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
        cell: info => (
          <Tooltip label="Edit Category">
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
        ),
      },
    ],
    [openEdit],
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
          Categories Management
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
    </Container>
  );
};

export default CategoriesPage;
