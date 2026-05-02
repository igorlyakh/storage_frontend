import { BarChart, LineChart } from '@mantine/charts';
import {
  Box,
  Card,
  Group,
  LoadingOverlay,
  SegmentedControl,
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

  const [metric, setMetric] = useState('orders');

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

  const monthlyChartData = useMemo(() => {
    return monthlyData.map(item => ({
      storeName: item.storeName,
      value: metric === 'orders' ? item.totalOrders : item.totalItems,
    }));
  }, [monthlyData, metric]);

  const { yearlyChartData, yearlySeries } = useMemo(() => {
    const formattedData = [];
    const storesSet = new Set();

    yearlyData.forEach(monthData => {
      const row = { month: monthData.month };

      Object.entries(monthData.stores).forEach(([storeName, stats]) => {
        storesSet.add(storeName);
        row[storeName] = metric === 'orders' ? stats.orders : stats.items;
      });

      formattedData.push(row);
    });

    const colors = [
      'blue.6',
      'teal.6',
      'violet.6',
      'orange.6',
      'pink.6',
      'red.6',
      'cyan.6',
    ];
    const series = Array.from(storesSet).map((storeName, index) => ({
      name: storeName,
      color: colors[index % colors.length],
    }));

    return { yearlyChartData: formattedData, yearlySeries: series };
  }, [yearlyData, metric]);

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Group
        justify="space-between"
        align="flex-end"
      >
        <Title order={2}>Statistics Dashboard</Title>

        <SegmentedControl
          value={metric}
          onChange={setMetric}
          data={[
            { label: 'Orders Count', value: 'orders' },
            { label: 'Items Count (Qty)', value: 'items' },
          ]}
        />
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
            placeholder="All Products"
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
            mb="md"
          >
            Stores Performance ({month}/{year})
          </Title>
          <Box
            pos="relative"
            h={300}
          >
            <LoadingOverlay
              visible={isMonthlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {monthlyChartData.length > 0 ? (
              <BarChart
                h={300}
                data={monthlyChartData}
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
                No data for this period
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
            mb="md"
          >
            Yearly Dynamics ({year})
          </Title>
          <Box
            pos="relative"
            h={300}
          >
            <LoadingOverlay
              visible={isYearlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {yearlyChartData.length > 0 && yearlySeries.length > 0 ? (
              <LineChart
                h={300}
                data={yearlyChartData}
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
                No data for this period
              </Text>
            )}
          </Box>
        </Card>
      </SimpleGrid>
    </Stack>
  );
};

export default StatisticsPage;
