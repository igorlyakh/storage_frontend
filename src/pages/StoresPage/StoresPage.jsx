import { Badge, Box, Container, Group, LoadingOverlay, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import DataTable from '../../components/ui/DataTable';
import { useGetAllStoresQuery } from '../../store/api/api';
import getBrandColor from '../../utils/getBrandColor';

const StoresPage = () => {
  const { data: stores = [], isLoading } = useGetAllStoresQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Store Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'brands',
        header: 'Assigned Brands',
        cell: info => {
          const brands = info.getValue() || [];
          return (
            <Group gap={5}>
              {brands.length > 0 ? (
                brands.map(brand => (
                  <Badge
                    key={brand.id}
                    variant="light"
                    size="sm"
                    color={getBrandColor(brand.name)}
                  >
                    {brand.name}
                  </Badge>
                ))
              ) : (
                <Text
                  size="xs"
                  c="dimmed"
                >
                  No brands
                </Text>
              )}
            </Group>
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
          Stores Management
        </Title>

        <DataTable
          data={stores}
          columns={columns}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </Box>
    </Container>
  );
};

export default StoresPage;
