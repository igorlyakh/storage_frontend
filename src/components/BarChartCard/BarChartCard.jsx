import { BarChart } from '@mantine/charts';
import { Box, Card, LoadingOverlay, Text, Title } from '@mantine/core';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

const BarChartCard = ({
  data,
  isFetching,
  chartLabel,
  groupKey = 'storeName',
  title,
}) => {
  const { t } = useTranslation('statistics');

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const grouped = data.reduce((acc, item) => {
      acc[item[groupKey]] = (acc[item[groupKey]] || 0) + item.value;
      return acc;
    }, {});

    return Object.entries(grouped)
      .map(([name, value]) => ({
        [groupKey]: name,
        value,
      }))
      .sort((a, b) => b.value - a.value);
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
        {title || t('chart.totalByStore')}
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
        {chartData.length > 0 ? (
          <BarChart
            h={300}
            data={chartData}
            dataKey={groupKey}
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
            {t('chart.noData')}
          </Text>
        )}
      </Box>
    </Card>
  );
};

export default BarChartCard;
