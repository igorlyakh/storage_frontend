import { BarChart } from '@mantine/charts';
import { Box, Card, LoadingOverlay, ScrollArea, Text, Title } from '@mantine/core';
import { forwardRef } from 'react';

const MonthlyChartCard = forwardRef(({ data, isFetching, chartLabel }, ref) => {
  const chartWidth = `max(100%, ${data.length * 50}px)`;

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'sm', sm: 'md' }}
    >
      <Title
        order={4}
        mb="xs"
        fz={{ base: 18, sm: 20 }}
      >
        Monthly Comparison
      </Title>
      <Text
        c="dimmed"
        size={{ base: 'xs', sm: 'sm' }}
        mb={{ base: 'sm', sm: 'md' }}
      >
        {chartLabel}
      </Text>

      <ScrollArea offsetScrollbars>
        <Box
          pos="relative"
          h={{ base: 250, sm: 300 }}
          w={chartWidth}
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
              h={{ base: 250, sm: 300 }}
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
              mt={{ base: 80, sm: 100 }}
            >
              No data
            </Text>
          )}
        </Box>
      </ScrollArea>
    </Card>
  );
});

export default MonthlyChartCard;
