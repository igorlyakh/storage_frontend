import { LineChart } from '@mantine/charts';
import { Box, Card, LoadingOverlay, Text, Title } from '@mantine/core';
import { forwardRef, useMemo } from 'react';

const YearlyChartCard = forwardRef(({ data, isFetching, chartLabel }, ref) => {
  const yearlySeries = useMemo(() => {
    if (data.length === 0) return [];
    const stores = Object.keys(data[0]).filter(key => key !== 'month');
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
  }, [data]);

  return (
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
