import { BarChart, LineChart } from '@mantine/charts';
import {
  Box,
  Card,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import {
  useGetAllProductsQuery,
  useGetMonthlyStatsQuery,
  useGetYearlyStatsQuery,
} from '../../store/api/api';

const StatisticsPage = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState(currentMonth.toString());
  const [productId, setProductId] = useState(null);

  const { data: products = [] } = useGetAllProductsQuery();
  const productOptions = products.map(p => ({
    value: p.id,
    label: p.name,
  }));

  const { data: monthlyData = [], isFetching: isMonthlyFetching } =
    useGetMonthlyStatsQuery({
      year: Number(year),
      month: Number(month),
      productId,
    });

  const { data: yearlyData = [], isFetching: isYearlyFetching } = useGetYearlyStatsQuery({
    year: Number(year),
    productId,
  });

  const yearlySeries = useMemo(() => {
    if (yearlyData.length === 0) return [];

    const stores = Object.keys(yearlyData[0]).filter(key => key !== 'month');
    const colors = [
      'blue.6',
      'teal.6',
      'violet.6',
      'orange.6',
      'pink.6',
      'red.6',
      'cyan.6',
    ];

    return stores.map((storeName, index) => ({
      name: storeName,
      color: colors[index % colors.length],
    }));
  }, [yearlyData]);

  const chartLabel = productId ? 'Items Quantity Ordered' : 'Total Orders Count';

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Group
        justify="space-between"
        align="flex-end"
      >
        <Title order={2}>Global Statistics</Title>
      </Group>

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

      <SimpleGrid
        cols={{ base: 1, lg: 2 }}
        spacing="lg"
        mt="md"
      >
        <Card
          withBorder
          shadow="sm"
          radius="md"
          p="md"
        >
          <Title
            order={4}
            mb="xs"
          >
            Monthly Comparison
          </Title>
          <Text
            c="dimmed"
            size="sm"
            mb="md"
          >
            {chartLabel}
          </Text>

          <Box
            pos="relative"
            h={300}
          >
            <LoadingOverlay
              visible={isMonthlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {monthlyData.length > 0 ? (
              <BarChart
                h={300}
                data={monthlyData}
                dataKey="storeName"
                series={[{ name: 'value', color: 'blue.6' }]}
                tickLine="y"
                tooltipAnimationDuration={200}
              />
            ) : (
              <Text
                c="dimmed"
                ta="center"
                mt={100}
              >
                No data
              </Text>
            )}
          </Box>
        </Card>

        <Card
          withBorder
          shadow="sm"
          radius="md"
          p="md"
        >
          <Title
            order={4}
            mb="xs"
          >
            Yearly Dynamics
          </Title>
          <Text
            c="dimmed"
            size="sm"
            mb="md"
          >
            {chartLabel}
          </Text>

          <Box
            pos="relative"
            h={300}
          >
            <LoadingOverlay
              visible={isYearlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {yearlyData.length > 0 && yearlySeries.length > 0 ? (
              <LineChart
                h={300}
                data={yearlyData}
                dataKey="month"
                series={yearlySeries}
                curveType="monotone"
                tickLine="xy"
                withLegend
                legendProps={{ verticalAlign: 'bottom' }}
                tooltipAnimationDuration={200}
              />
            ) : (
              <Text
                c="dimmed"
                ta="center"
                mt={100}
              >
                No data
              </Text>
            )}
          </Box>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default StatisticsPage;
