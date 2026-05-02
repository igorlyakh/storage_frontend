import { Card, Select, SimpleGrid } from '@mantine/core';

const StatisticsFilters = ({
  year,
  setYear,
  month,
  setMonth,
  productId,
  setProductId,
  productOptions,
}) => {
  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p="md"
    >
      <SimpleGrid
        cols={{ base: 1, sm: 3 }}
        spacing="md"
      >
        <Select
          label="Year"
          data={['2023', '2024', '2025', '2026']}
          value={year}
          onChange={setYear}
          allowDeselect={false}
        />
        <Select
          label="Month"
          data={[
            { value: '1', label: 'January' },
            { value: '2', label: 'February' },
            { value: '3', label: 'March' },
            { value: '4', label: 'April' },
            { value: '5', label: 'May' },
            { value: '6', label: 'June' },
            { value: '7', label: 'July' },
            { value: '8', label: 'August' },
            { value: '9', label: 'September' },
            { value: '10', label: 'October' },
            { value: '11', label: 'November' },
            { value: '12', label: 'December' },
          ]}
          value={month}
          onChange={setMonth}
          allowDeselect={false}
        />
        <Select
          label="Product Filter"
          placeholder="All Products (Orders count)"
          data={productOptions}
          value={productId}
          onChange={setProductId}
          searchable
          clearable
        />
      </SimpleGrid>
    </Card>
  );
};

export default StatisticsFilters;
