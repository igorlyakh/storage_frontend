import { LineChart } from '@mantine/charts';
import {
  Box,
  Card,
  Group,
  LoadingOverlay,
  MultiSelect,
  Text,
  Title,
} from '@mantine/core';
import { forwardRef, useMemo, useState } from 'react';

const YearlyChartCard = forwardRef(({ data, isFetching, chartLabel }, ref) => {
  const [selectedStores, setSelectedStores] = useState([]);

  const allStoresOptions = useMemo(() => {
    if (data.length === 0) return [];
    return Object.keys(data[0]).filter(key => key !== 'month');
  }, [data]);

  const yearlySeries = useMemo(() => {
    if (data.length === 0) return [];

    const allStores = Object.keys(data[0]).filter(key => key !== 'month');

    const storesToShow =
      selectedStores.length > 0 ? selectedStores : allStores.slice(0, 3);

    const colors = [
      'blue.6',
      'teal.6',
      'violet.6',
      'orange.6',
      'pink.6',
      'red.6',
      'cyan.6',
    ];

    return storesToShow.map((storeName, index) => ({
      name: storeName,
      color: colors[index % colors.length],
    }));
  }, [data, selectedStores]);

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p="md"
    >
      <Group
        justify="space-between"
        align="flex-start"
        mb="md"
      >
        <div>
          <Title
            order={4}
            mb="xs"
          >
            Yearly Dynamics
          </Title>
          <Text
            c="dimmed"
            size="sm"
          >
            {chartLabel}
          </Text>
        </div>

        <MultiSelect
          placeholder="Select stores to compare"
          data={allStoresOptions}
          value={selectedStores}
          onChange={setSelectedStores}
          searchable
          clearable
          maxValues={10}
          w={250}
        />
      </Group>

      <Box
        pos="relative"
        h={300}
        w="100%"
        style={{ minHeight: 300 }}
        ref={ref}
        bg="white"
      >
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
        />
        {data.length > 0 && yearlySeries.length > 0 ? (
          <LineChart
            h={300}
            data={data}
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
  );
});

export default YearlyChartCard;
