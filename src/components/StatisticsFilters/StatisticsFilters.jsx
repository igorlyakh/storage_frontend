import { Button, Card, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';

const StatisticsFilters = ({
  dateRange,
  setDateRange,
  productId,
  setProductId,
  productOptions,
  storeId,
  setStoreId,
  storeOptions,
}) => {
  const setToday = () => {
    const today = new Date();
    setDateRange([today, today]);
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDateRange([firstDay, lastDay]);
  };

  const setThisYear = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    setDateRange([firstDay, lastDay]);
  };

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'sm', sm: 'md' }}
    >
      <Stack spacing="sm">
        <Group
          position="apart"
          align="flex-end"
        >
          <DatePickerInput
            type="range"
            label="Date Range (Required)"
            placeholder="Pick dates range"
            value={dateRange}
            onChange={setDateRange}
            clearable
            size={{ base: 'md', sm: 'sm' }}
            style={{ flexGrow: 1, maxWidth: '400px' }}
            required
            error={!dateRange?.[0] ? 'Please select a date range' : null}
          />

          <Group
            spacing="xs"
            mt={{ base: 'xs', sm: 0 }}
          >
            <Text
              size="sm"
              weight={500}
              c="dimmed"
              mr="xs"
            >
              Quick select:
            </Text>
            <Button
              variant="light"
              size="xs"
              onClick={setToday}
            >
              Today
            </Button>
            <Button
              variant="light"
              size="xs"
              onClick={setThisMonth}
            >
              This Month
            </Button>
            <Button
              variant="light"
              size="xs"
              onClick={setThisYear}
            >
              This Year
            </Button>
          </Group>
        </Group>

        <SimpleGrid
          cols={{ base: 1, sm: 2 }}
          spacing={{ base: 'sm', sm: 'md' }}
          mt="sm"
        >
          <Select
            label="Store Filter"
            placeholder="All Stores"
            data={storeOptions}
            value={storeId}
            onChange={setStoreId}
            searchable
            clearable
            size={{ base: 'md', sm: 'sm' }}
          />

          <Select
            label="Product Filter"
            placeholder="All Products"
            data={productOptions}
            value={productId}
            onChange={setProductId}
            searchable
            clearable
            size={{ base: 'md', sm: 'sm' }}
          />
        </SimpleGrid>
      </Stack>
    </Card>
  );
};

export default StatisticsFilters;
