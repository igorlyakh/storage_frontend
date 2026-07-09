import { Center, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import RequestsList from '../../components/RequestsList';
import FilterPopover from '../../components/ui/FilterPopover';
import {
  useGetAdminWarehouseRequestsQuery,
  useGetWarehouseRequestsQuery,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const RequestsPage = () => {
  const { t } = useTranslation('requests');
  const userRole = useSelector(userRoleSelector);

  const [statuses, setStatuses] = useState([]);
  const [dateRange, setDateRange] = useState([null, null]);

  const statusOptions = [
    { value: 'NEW', label: t('status.NEW') },
    { value: 'APPROVED', label: t('status.APPROVED') },
    { value: 'SENT', label: t('status.SENT') },
    { value: 'COMPLETED', label: t('status.COMPLETED') },
  ];

  const filters = {
    status: statuses.length ? statuses.join(',') : undefined,
    startDate: dateRange[0] ? dayjs(dateRange[0]).format('YYYY-MM-DD') : undefined,
    endDate: dateRange[1] ? dayjs(dateRange[1]).format('YYYY-MM-DD') : undefined,
  };

  const {
    data: adminRequests,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminWarehouseRequestsQuery(filters, {
    skip: userRole !== 'ADMIN',
  });

  const {
    data: warehouseRequests,
    isLoading: isWarehouseLoading,
    isError: isWarehouseError,
  } = useGetWarehouseRequestsQuery(filters, {
    skip: userRole !== 'WAREHOUSE',
  });

  const requests = userRole === 'ADMIN' ? adminRequests : warehouseRequests;
  const isLoading = userRole === 'ADMIN' ? isAdminLoading : isWarehouseLoading;
  const isError = userRole === 'ADMIN' ? isAdminError : isWarehouseError;

  if (isError) {
    return (
      <Text
        c="red"
        textAlign="center"
        mt="xl"
      >
        {t('loadFailed')}
      </Text>
    );
  }

  return (
    <Stack
      gap="md"
      p="md"
    >
      <Title order={2}>{t('pageTitle')}</Title>

      <Group
        align="center"
        gap="md"
      >
        <FilterPopover
          label={t('filters.statuses')}
          options={statusOptions}
          values={statuses}
          onChange={setStatuses}
        />

        <DatePickerInput
          type="range"
          placeholder={t('filters.filterByDate')}
          value={dateRange}
          onChange={setDateRange}
          clearable
          w={{ base: '100%', sm: 260 }}
        />
      </Group>

      {isLoading ? (
        <Center h={200}>
          <Loader color="blue" />
        </Center>
      ) : (
        <RequestsList requests={requests || []} />
      )}
    </Stack>
  );
};

export default RequestsPage;
