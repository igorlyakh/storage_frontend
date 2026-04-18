import {
  Box,
  Button,
  Checkbox,
  CloseButton,
  Divider,
  Group,
  LoadingOverlay,
  Pagination,
  Popover,
  ScrollArea,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetAllOrdersQuery, useGetAllStoresQuery } from '../../store/api/api';

// 1. Обновленный FilterPopover с кнопками "Select All" и "Clear"
const FilterPopover = ({ label, options, values, onChange }) => {
  // Обработчик клика по одному чекбоксу
  const handleToggle = val => {
    const newValues = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val];
    onChange(newValues);
  };

  // Обработчик "Выбрать всё"
  const handleSelectAll = () => {
    const allValues = options.map(opt => opt.value);
    onChange(allValues);
  };

  // Обработчик "Снять всё"
  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Popover
      width={250}
      position="bottom-start"
      shadow="md"
      withArrow
    >
      <Popover.Target>
        <Button
          variant="default"
          w={{ base: '100%', sm: 200 }}
          style={{ fontWeight: 500 }}
        >
          {values.length > 0 ? `${label} (${values.length})` : `All ${label}`}
        </Button>
      </Popover.Target>

      <Popover.Dropdown p="sm">
        <Stack gap="xs">
          {/* Панель массовых действий */}
          <Group
            grow
            gap="xs"
          >
            <Button
              size="xs"
              variant="light"
              color="blue"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              size="xs"
              variant="light"
              color="gray"
              onClick={handleClearAll}
              disabled={values.length === 0}
            >
              Clear
            </Button>
          </Group>

          <Divider my="xs" />

          {/* Список чекбоксов */}
          <ScrollArea.Autosize
            mah={220}
            type="scroll"
          >
            <Stack gap="sm">
              {options.map(opt => (
                <Checkbox
                  key={opt.value}
                  label={opt.label}
                  checked={values.includes(opt.value)}
                  onChange={() => handleToggle(opt.value)}
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

// 2. Главная страница
const AllOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState(['NEW', 'IN_PROGRESS']);
  const [storeIds, setStoreIds] = useState([]);
  const [date, setDate] = useState('');

  const { data: storesData } = useGetAllStoresQuery();
  const stores = storesData || [];

  const storeOptions = stores.map(store => ({
    value: store.id,
    label: store.name || `Store #${store.id}`,
  }));

  const statusOptions = [
    { value: 'NEW', label: 'NEW' },
    { value: 'IN_PROGRESS', label: 'IN_PROGRESS' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'SENT', label: 'SENT' },
  ];

  const { data, isFetching } = useGetAllOrdersQuery(
    {
      page,
      statuses: statuses.length ? statuses.join(',') : undefined,
      storeIds: storeIds.length ? storeIds.join(',') : undefined,
      date: date || undefined,
    },
    {
      pollingInterval: 10 * 60 * 1000,
      skipPollingIfUnfocused: true,
      refetchOnFocus: true,
    },
  );

  const orders = data?.data || [];
  const meta = data?.meta;

  // Обновленные обработчики (теперь принимают готовый массив)
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
            value={date}
            onChange={e => {
              setDate(e.target.value);
              setPage(1);
            }}
            w={{ base: '100%', sm: 180 }}
          />
          {date && (
            <CloseButton
              size="lg"
              onClick={() => {
                setDate('');
                setPage(1);
              }}
              title="Clear date"
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
