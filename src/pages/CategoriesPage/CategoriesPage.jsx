import { Box, Container, LoadingOverlay, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import { useGetAllCategoriesQuery } from '../../store/api/api';

const CategoriesPage = () => {
  const { data: categories = [], isLoading } = useGetAllCategoriesQuery();

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
    ],
    [],
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
    </Container>
  );
};

export default CategoriesPage;
