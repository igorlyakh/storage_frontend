import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  LoadingOverlay,
  Pagination,
  Popover,
  ScrollArea,
  Stack,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useSearchParams } from 'react-router-dom';
import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetMyOrdersQuery } from '../../store/api/api';

const DEFAULT_STATUSES = ['NEW', 'IN_PROGRESS', 'SENT', 'BACKORDER'];

const FilterPopover = ({ label, options, values, onChange }) => {
  const handleToggle = val => {
    const newValues = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    const allValues = options.map(opt => opt.value);
    onChange(allValues);
  };

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

const MyOrdersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = Number(searchParams.get('page')) || 1;
  const statuses = searchParams.has('statuses')
    ? searchParams.get('statuses').split(',').filter(Boolean)
    : DEFAULT_STATUSES;
  const date = searchParams.get('date') || '';

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

  const statusOptions = [
    { value: 'NEW', label: 'NEW' },
    { value: 'IN_PROGRESS', label: 'IN PROGRESS' },
    { value: 'SENT', label: 'SENT' },
    { value: 'COMPLETED', label: 'COMPLETED' },
    { value: 'BACKORDER', label: 'BACKORDER' },
  ];

  const { data, isFetching } = useGetMyOrdersQuery(
    {
      page,
      statuses: statuses.length ? statuses.join(',') : undefined,
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

  const handleStatusesChange = newStatuses => {
    updateParams({ statuses: newStatuses, page: undefined });
  };

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Title order={2}>My Orders</Title>

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

        <DatePickerInput
          placeholder="Filter by date"
          value={date ? new Date(date) : null}
          onChange={val =>
            updateParams({
              date: val ? dayjs(val).format('YYYY-MM-DD') : undefined,
              page: undefined,
            })
          }
          clearable
          w={{ base: '100%', sm: 200 }}
        />
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

export default MyOrdersPage;
