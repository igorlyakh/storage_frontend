import { BarChart } from '@mantine/charts';
import { Box, Card, LoadingOverlay, Text, Title } from '@mantine/core';
import { forwardRef } from 'react';

const MonthlyChartCard = forwardRef(({ data, isFetching, chartLabel }, ref) => {
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
        ref={ref}
        bg="white"
      >
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
        />
        {data.length > 0 ? (
          <BarChart
            h={300}
            data={data}
            dataKey="storeName"
            series={[{ name: 'value', label: chartLabel, color: 'blue.6' }]}
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
  );
});

export default MonthlyChartCard;
