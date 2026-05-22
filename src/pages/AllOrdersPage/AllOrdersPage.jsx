import {
  Box,
  CloseButton,
  Group,
  LoadingOverlay,
  Pagination,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import OrdersList from '../../components/OrdersList/OrdersList';
import FilterPopover from '../../components/ui/FilterPopover';
import { useGetAllOrdersQuery, useGetAllStoresQuery } from '../../store/api/api';

const AllOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState(['NEW', 'IN_PROGRESS']);
  const [storeIds, setStoreIds] = useState([]);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: storesData } = useGetAllStoresQuery();
  const stores = storesData || [];

  const storeOptions = stores.map(store => ({
    value: store.id,
    label: store.name || `Store #${store.id}`,
  }));

  const statusOptions = [
    { value: 'NEW', label: 'NEW' },
    { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
    { value: 'SENT', label: 'SENT' },
    { value: 'COMPLETED', label: 'COMPLETED' },
  ];

  const { data, isFetching } = useGetAllOrdersQuery(
    {
      page,
      statuses: statuses.length ? statuses.join(',') : undefined,
      storeIds: storeIds.length ? storeIds.join(',') : undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
    },
    {
      pollingInterval: 3 * 60 * 1000,
      skipPollingIfUnfocused: true,
      refetchOnFocus: true,
    },
  );

  const orders = data?.data || [];
  const meta = data?.meta;

  const handleStatusesChange = newStatuses => {
    setStatuses(newStatuses);
    setPage(1);
  };

  const handleStoresChange = newStores => {
    setStoreIds(newStores);
    setPage(1);
  };

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Title order={2}>All Orders</Title>

      <Group
        align="center"
        gap="md"
      >
        <FilterPopover
          label="Statuses"
          options={statusOptions}
          values={statuses}
          onChange={handleStatusesChange}
        />

        <FilterPopover
          label="Stores"
          options={storeOptions}
          values={storeIds}
          onChange={handleStoresChange}
        />

        <Group
          gap="xs"
          align="center"
        >
          <TextInput
            type="date"
            placeholder="From"
            value={startDate}
            onChange={e => {
              setStartDate(e.target.value);
              setPage(1);
            }}
            w={{ base: '100%', sm: 140 }}
          />

          <Text
            size="sm"
            c="dimmed"
          >
            -
          </Text>

          <TextInput
            type="date"
            placeholder="To"
            value={endDate}
            onChange={e => {
              setEndDate(e.target.value);
              setPage(1);
            }}
            w={{ base: '100%', sm: 140 }}
          />

          {(startDate || endDate) && (
            <CloseButton
              size="lg"
              onClick={() => {
                setStartDate('');
                setEndDate('');
                setPage(1);
              }}
              title="Clear dates"
            />
          )}
        </Group>
      </Group>

      <Box
        pos="relative"
        minHeight={200}
      >
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
        />
        <OrdersList data={orders} />
      </Box>

      {meta && meta.lastPage > 1 && (
        <Group
          justify="center"
          mt="md"
        >
          <Pagination
            value={page}
            onChange={setPage}
            total={meta.lastPage}
            disabled={isFetching}
            color="blue"
            radius="md"
            withEdges
          />
        </Group>
      )}
    </Stack>
  );
};

export default AllOrdersPage;
