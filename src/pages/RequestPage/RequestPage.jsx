import {
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  Paper,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  useGetWarehouseRequestByIdQuery,
  useUpdateWarehouseRequestStatusMutation,
} from '../../store/api/api';

const RequestPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetWarehouseRequestByIdQuery(id);
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateWarehouseRequestStatusMutation();

  const columns = [
    {
      accessorKey: 'product.name',
      header: 'Product',
      cell: info => <Text fw={500}>{info.getValue()}</Text>,
    },
    {
      accessorKey: 'product.category',
      header: 'Category',
      cell: info => <Badge variant="outline">{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'quantity',
      header: 'Quantity',
      cell: info => <Text>{info.getValue()} pcs.</Text>,
    },
  ];

  const table = useReactTable({
    data: data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  // Функция для смены статуса
  const handleUpdateStatus = async newStatus => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated on: ${newStatus}`);
    } catch (error) {
      toast.error('Error!');
      console.error(error);
    }
  };

  const renderActionButton = () => {
    switch (data?.status) {
      case 'APPROVED':
        return (
          <Button
            size="sm"
            color="yellow"
            loading={isUpdating}
            onClick={() => handleUpdateStatus('SENT')}
          >
            Send
          </Button>
        );
      case 'SENT':
        return (
          <Button
            size="sm"
            color="green"
            loading={isUpdating}
            onClick={() => handleUpdateStatus('COMPLETED')}
          >
            Accept
          </Button>
        );
      default:
        return null;
    }
  };

  const getStatusColor = status => {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'APPROVED':
        return 'yellow';
      case 'SENT':
        return 'orange';
      case 'COMPLETED':
        return 'green';
      default:
        return 'gray';
    }
  };

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader color="blue" />
      </Center>
    );
  }

  if (isError || !data) {
    return (
      <Text
        c="red"
        textAlign="center"
      >
        No data!
      </Text>
    );
  }

  return (
    <Stack
      gap="md"
      p="md"
    >
      <Paper
        withBorder
        p="md"
        radius="md"
        shadow="sm"
      >
        <Group
          justify="space-between"
          align="flex-start"
        >
          <Box>
            <Title
              order={4}
              mb={5}
            >
              Details
            </Title>
            <Text
              size="xs"
              c="dimmed"
            >
              ID: {data.id}
            </Text>
            <Text size="sm">
              Created At: {dayjs(data.createdAt).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Box>

          <Stack
            align="flex-end"
            gap="xs"
          >
            <Group>
              {renderActionButton()}

              <Badge
                size="xl"
                color={getStatusColor(data.status)}
              >
                {data.status}
              </Badge>
            </Group>

            <Text
              size="xs"
              c="dimmed"
            >
              Category: {data.category}
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Paper
        withBorder
        radius="md"
        overflow="hidden"
      >
        <Table
          verticalSpacing="sm"
          highlightOnHover
        >
          <Table.Thead bg="gray.0">
            {table.getHeaderGroups().map(headerGroup => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.Th key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.map(row => (
              <Table.Tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <Table.Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Table.Td>
                ))}
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>
    </Stack>
  );
};

export default RequestPage;
