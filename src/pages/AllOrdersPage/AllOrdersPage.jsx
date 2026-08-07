import { Box, Group, LoadingOverlay, Pagination, Stack, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import OrdersList from '../../components/OrdersList/OrdersList';
import FilterPopover from '../../components/ui/FilterPopover';
import { useGetAllOrdersQuery, useGetAllStoresQuery } from '../../store/api/api';

const DEFAULT_STATUSES = ['NEW', 'IN_PROGRESS', 'BACKORDER'];

const AllOrdersPage = () => {
  const { t } = useTranslation('orders');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const statuses = searchParams.has('statuses')
    ? searchParams.get('statuses').split(',').filter(Boolean)
    : DEFAULT_STATUSES;
  const storeIds = searchParams.has('storeIds')
    ? searchParams
        .get('storeIds')
        .split(',')
        .filter(Boolean)
        .map(Number)
    : [];
  const startDate = searchParams.get('startDate') || '';
  const endDate = searchParams.get('endDate') || '';

  const updateParams = updates => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      Object.entries(updates).forEach(([key, value]) => {
        const isEmptyArray = Array.isArray(value) && value.length === 0;
        if (value === undefined || value === null || value === '' || isEmptyArray) {
          next.delete(key);
        } else if (Array.isArray(value)) {
          next.set(key, value.join(','));
        } else {
          next.set(key, String(value));
        }
      });
      return next;
    });
  };

  const { data: storesData } = useGetAllStoresQuery();
  const stores = storesData || [];

  const storeOptions = stores.map(store => ({
    value: store.id,
    label: store.name || t('storeFallback', { id: store.id }),
  }));

  const statusOptions = [
    { value: 'NEW', label: t('status.NEW') },
    { value: 'IN_PROGRESS', label: t('status.IN_PROGRESS') },
    { value: 'SENT', label: t('status.SENT') },
    { value: 'COMPLETED', label: t('status.COMPLETED') },
    { value: 'BACKORDER', label: t('status.BACKORDER') },
    { value: 'REJECTED', label: t('status.REJECTED') },
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
    updateParams({ statuses: newStatuses, page: undefined });
  };

  const handleStoresChange = newStores => {
    updateParams({ storeIds: newStores, page: undefined });
  };

  const handleDateRangeChange = ([start, end]) => {
    updateParams({
      startDate: start ? dayjs(start).format('YYYY-MM-DD') : undefined,
      endDate: end ? dayjs(end).format('YYYY-MM-DD') : undefined,
      page: undefined,
    });
  };

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Title order={2}>{t('allOrders')}</Title>

      <Group
        align="center"
        gap="md"
      >
        <FilterPopover
          label={t('filters.statuses')}
          options={statusOptions}
          values={statuses}
          onChange={handleStatusesChange}
        />

        <FilterPopover
          label={t('filters.stores')}
          options={storeOptions}
          values={storeIds}
          onChange={handleStoresChange}
        />

        <DatePickerInput
          type="range"
          placeholder={t('filters.filterByDate')}
          value={[startDate ? new Date(startDate) : null, endDate ? new Date(endDate) : null]}
          onChange={handleDateRangeChange}
          clearable
          w={{ base: '100%', sm: 260 }}
        />
      </Group>

      <Box
        pos="relative"
        mih={200}
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
            onChange={newPage => updateParams({ page: newPage })}
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
