import { LineChart } from '@mantine/charts';
import { Box, Card, LoadingOverlay, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const LineChartCard = ({ data, isFetching, chartLabel, groupKey = 'storeName' }) => {
  const { t } = useTranslation('statistics');

  const { chartData, series } = useMemo(() => {
    if (!data || data.length === 0) return { chartData: [], series: [] };

    const groupedByDate = {};
    const groupNames = new Set();

    data.forEach(item => {
      const name = item[groupKey];
      groupNames.add(name);
      if (!groupedByDate[item.date]) {
        groupedByDate[item.date] = { date: item.date };
      }
      groupedByDate[item.date][name] = (groupedByDate[item.date][name] || 0) + item.value;
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
    const generatedSeries = Array.from(groupNames).map((name, index) => ({
      name,
      color: colors[index % colors.length],
    }));

    const sortedData = Object.values(groupedByDate).sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );

    return { chartData: sortedData, series: generatedSeries };
  }, [data, groupKey]);

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
        {t('chart.dynamicsOverTime')}
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
        bg="white"
      >
        <LoadingOverlay
          visible={isFetching}
          zIndex={1000}
          overlayProps={{ blur: 2 }}
        />
        {chartData.length > 0 && series.length > 0 ? (
          <LineChart
            h={300}
            data={chartData}
            dataKey="date"
            series={series}
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
            {t('chart.noData')}
          </Text>
        )}
      </Box>
    </Card>
  );
};

export default LineChartCard;
