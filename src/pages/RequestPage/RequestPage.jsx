import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Center,
  Group,
  Loader,
  NumberInput,
  Paper,
  Select,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import dayjs from 'dayjs';
import { Check, Edit, Plus, Trash, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import {
  useGetAllProductsQuery,
  useGetWarehouseRequestByIdQuery,
  useUpdateWarehouseRequestItemsMutation,
  useUpdateWarehouseRequestStatusMutation,
} from '../../store/api/api';

const RequestPage = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useGetWarehouseRequestByIdQuery(id);
  const { data: allProducts } = useGetAllProductsQuery();
  const [updateStatus, { isLoading: isUpdating }] =
    useUpdateWarehouseRequestStatusMutation();
  const [updateItems, { isLoading: isSavingItems }] =
    useUpdateWarehouseRequestItemsMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [draftItems, setDraftItems] = useState([]);

  const canEdit = !isEditing && data?.status !== 'COMPLETED';

  useEffect(() => {
    if (data?.items && !isEditing) {
      setDraftItems(
        data.items.map(item => ({
          tempId: Math.random().toString(36).substr(2, 9),
          productId: item.productId,
          quantity: item.quantity,
          product: item.product,
        })),
      );
    }
  }, [data, isEditing]);

  const handleUpdateStatus = async newStatus => {
    try {
      await updateStatus({ id, status: newStatus }).unwrap();
      toast.success(`Status updated to: ${newStatus}`);
    } catch (error) {
      toast.error('Error updating status!');
      console.error(error);
    }
  };

  const handleSaveDraft = async () => {
    try {
      const payload = draftItems.map(i => ({
        productId: i.productId,
        quantity: i.quantity,
      }));

      await updateItems({ id, items: payload }).unwrap();
      toast.success('Items updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Error saving items!');
      console.error(error);
    }
  };

  const updateDraftItem = useCallback(
    (index, field, value) => {
      setDraftItems(prev => {
        const newDraft = [...prev];
        newDraft[index] = { ...newDraft[index], [field]: value };

        if (field === 'productId') {
          const selectedProd = allProducts?.find(p => p.id === value);
          if (selectedProd) {
            newDraft[index].product = selectedProd;
          }
        }
        return newDraft;
      });
    },
    [allProducts],
  );

  const removeDraftItem = useCallback(index => {
    setDraftItems(prev => prev.filter((_, i) => i !== index));
  }, []);

  const addDraftItem = useCallback(() => {
    setDraftItems(prev => [
      ...prev,
      {
        tempId: Math.random().toString(36).substr(2, 9),
        productId: '',
        quantity: 1,
        product: null,
      },
    ]);
  }, []);

  const productSelectData = useMemo(() => {
    return (
      allProducts?.map(p => ({
        value: p.id,
        label: `${p.article} - ${p.name}`,
      })) || []
    );
  }, [allProducts]);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'product.article',
        header: 'Article',
        cell: info => {
          if (isEditing) return null;
          return (
            <Text
              fw={500}
              c="gray"
            >
              {info.getValue()}
            </Text>
          );
        },
      },
      {
        accessorKey: 'product.name',
        header: 'Product',
        cell: ({ row }) => {
          const item = row.original;

          if (isEditing) {
            return (
              <Select
                placeholder="Select product"
                data={productSelectData}
                value={item.productId}
                onChange={val => updateDraftItem(row.index, 'productId', val)}
                searchable
              />
            );
          }
          return <Text fw={500}>{item.product?.name}</Text>;
        },
      },
      {
        accessorKey: 'product.category.name',
        header: 'Category',
        cell: ({ row }) => {
          const item = row.original;
          if (isEditing) return null;
          return <Badge variant="outline">{item.product?.category?.name || 'N/A'}</Badge>;
        },
      },
      {
        accessorKey: 'quantity',
        header: 'Quantity',
        cell: ({ row }) => {
          const item = row.original;

          if (isEditing) {
            return (
              <NumberInput
                value={item.quantity}
                onChange={val => updateDraftItem(row.index, 'quantity', val)}
                min={1}
                w={100}
              />
            );
          }
          return <Text>{item.quantity} pcs.</Text>;
        },
      },
      ...(isEditing
        ? [
            {
              id: 'actions',
              header: '',
              cell: ({ row }) => (
                <ActionIcon
                  color="red"
                  onClick={() => removeDraftItem(row.index)}
                >
                  <Trash size={18} />
                </ActionIcon>
              ),
            },
          ]
        : []),
    ],
    [isEditing, productSelectData, updateDraftItem, removeDraftItem],
  );

  const table = useReactTable({
    data: isEditing ? draftItems : data?.items || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row, index) => row.tempId || index,
  });

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

  if (isLoading)
    return (
      <Center h={200}>
        <Loader color="blue" />
      </Center>
    );
  if (isError || !data)
    return (
      <Text
        c="red"
        textAlign="center"
      >
        No data!
      </Text>
    );

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

      <Group justify="space-between">
        <Title order={5}>Items</Title>
        <Group>
          {canEdit && (
            <Button
              leftSection={<Edit size={16} />}
              variant="light"
              onClick={() => setIsEditing(true)}
            >
              Edit Items
            </Button>
          )}
          {isEditing && (
            <>
              <Button
                leftSection={<Plus size={16} />}
                variant="outline"
                onClick={addDraftItem}
              >
                Add Item
              </Button>
              <Button
                leftSection={<X size={16} />}
                color="red"
                variant="subtle"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button
                leftSection={<Check size={16} />}
                color="green"
                loading={isSavingItems}
                onClick={handleSaveDraft}
              >
                Save Changes
              </Button>
            </>
          )}
        </Group>
      </Group>

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
