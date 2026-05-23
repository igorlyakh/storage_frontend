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
import { Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import DataTable from '../../components/ui/DataTable';
import DeleteBrandModal from '../../components/ui/DeleteBrandModal';
import { useGetAllBrandsQuery } from '../../store/api/api';

const BrandsPage = () => {
  const { data: brands = [], isLoading } = useGetAllBrandsQuery();
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedBrand, setSelectedBrand] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Brand Name',
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
          <Tooltip label="Delete Brand">
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
        ),
      },
    ],
    [openDelete],
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
          Brands Management
        </Title>

        <DataTable
          data={brands}
          columns={columns}
          initialState={{ sorting: [{ id: 'name', desc: false }] }}
        />
      </Box>

      <DeleteBrandModal
        opened={openedDelete}
        onClose={closeDelete}
        brand={selectedBrand}
      />
    </Container>
  );
};

export default BrandsPage;
