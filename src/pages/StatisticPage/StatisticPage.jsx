import {
  Button,
  Center,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { saveAs } from 'file-saver';
import { Download, Info, Package, PackageCheck, ShoppingCart, TrendingUp } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BarChartCard from '../../components/BarChartCard';
import LineChartCard from '../../components/LineChartCard';
import StatisticsFilters from '../../components/StatisticsFilters';
import StatTile from '../../components/ui/StatTile';

import {
  useExportExcelMutation,
  useGetAllProductsQuery,
  useGetAllStoresQuery,
  useGetStatisticsDataQuery,
} from '../../store/api/api';

const METRIC_FIELD = {
  orders: 'orderCount',
  requested: 'requestedQty',
  shipped: 'shippedQty',
};

const StatisticsPage = () => {
  const { t } = useTranslation('statistics');
  const [dateRange, setDateRange] = useState([null, null]);
  const [productId, setProductId] = useState(null);
  const [storeId, setStoreId] = useState(null);
  const [metric, setMetric] = useState('shipped');

  const [exportExcel, { isLoading: isExporting }] = useExportExcelMutation();

  let finalStartDate = undefined;
  let finalEndDate = undefined;

  if (dateRange && dateRange[0]) {
    const s = new Date(dateRange[0]);
    s.setHours(0, 0, 0, 0);
    finalStartDate = s.toISOString();

    const e = new Date(dateRange[1] || dateRange[0]);
    e.setHours(23, 59, 59, 999);
    finalEndDate = e.toISOString();
  }

  const queryParams = {
    startDate: finalStartDate,
    endDate: finalEndDate,
    productId: productId || undefined,
    storeId: storeId || undefined,
  };

  const isDateSelected = !!finalStartDate;

  const { data: products = [] } = useGetAllProductsQuery();
  const productOptions = products.map(p => ({ value: p.id, label: p.name }));

  const { data: stores = [] } = useGetAllStoresQuery();
  const storeOptions = stores.map(s => ({ value: s.id, label: s.name }));

  const { data: statsData = [], isFetching } = useGetStatisticsDataQuery(queryParams, {
    skip: !isDateSelected,
  });

  const totals = useMemo(
    () =>
      statsData.reduce(
        (acc, row) => {
          acc.orders += row.orderCount ?? 0;
          acc.requested += row.requestedQty ?? 0;
          acc.shipped += row.shippedQty ?? 0;
          return acc;
        },
        { orders: 0, requested: 0, shipped: 0 },
      ),
    [statsData],
  );

  const fulfillmentRate =
    totals.requested > 0 ? Math.round((totals.shipped / totals.requested) * 100) : null;

  const chartData = useMemo(
    () => statsData.map(row => ({ ...row, value: row[METRIC_FIELD[metric]] ?? 0 })),
    [statsData, metric],
  );

  const METRIC_LABEL = {
    orders: t('chart.totalOrdersCount'),
    requested: t('chart.itemsRequested'),
    shipped: t('chart.itemsShipped'),
  };

  const chartLabel = METRIC_LABEL[metric];

  const handleExportExcel = async () => {
    try {
      const blob = await exportExcel(queryParams).unwrap();

      const startDateStr = dateRange[0]
        ? dateRange[0].toLocaleDateString('ru-RU')
        : t('exportFallbackAll');
      const endDateStr = dateRange[1]
        ? dateRange[1].toLocaleDateString('ru-RU')
        : t('exportFallbackAll');

      saveAs(blob, `Statistics_${startDateStr}_to_${endDateStr}.xlsx`);
    } catch (error) {
      console.error('Ошибка экспорта Excel:', error);
    }
  };

  return (
    <Stack
      gap="lg"
      p="md"
    >
      <Group
        justify="space-between"
        align="flex-end"
      >
        <Title order={2}>{t('globalTitle')}</Title>

        <Button
          leftSection={<Download size={18} />}
          onClick={handleExportExcel}
          variant="light"
          color="green"
          loading={isExporting}
          disabled={!isDateSelected || isFetching || statsData.length === 0}
        >
          {t('exportExcel')}
        </Button>
      </Group>

      <StatisticsFilters
        dateRange={dateRange}
        setDateRange={setDateRange}
        productId={productId}
        setProductId={setProductId}
        productOptions={productOptions}
        storeId={storeId}
        setStoreId={setStoreId}
        storeOptions={storeOptions}
      />

      {!isDateSelected ? (
        <Center h={300}>
          <Stack
            align="center"
            gap="xs"
          >
            <Info
              size={48}
              color="gray"
            />
            <Text
              c="dimmed"
              size="lg"
              fw={500}
            >
              {t('selectDateRangePrompt')}
            </Text>
          </Stack>
        </Center>
      ) : (
        <>
          <SimpleGrid
            cols={{ base: 2, sm: 4 }}
            spacing="md"
          >
            <StatTile
              label={t('metrics.orders')}
              value={totals.orders}
              icon={ShoppingCart}
              color="blue"
            />
            <StatTile
              label={t('metrics.requested')}
              value={totals.requested}
              icon={Package}
              color="grape"
            />
            <StatTile
              label={t('metrics.shipped')}
              value={totals.shipped}
              icon={PackageCheck}
              color="teal"
            />
            <StatTile
              label={t('metrics.fulfillmentRate')}
              value={fulfillmentRate === null ? '—' : `${fulfillmentRate}%`}
              icon={TrendingUp}
              color={
                fulfillmentRate === null || fulfillmentRate >= 90
                  ? 'teal'
                  : fulfillmentRate >= 60
                    ? 'yellow'
                    : 'red'
              }
            />
          </SimpleGrid>

          <Group justify="flex-end">
            <SegmentedControl
              value={metric}
              onChange={setMetric}
              data={[
                { label: t('chart.ordersLabel'), value: 'orders' },
                { label: t('chart.requestedQtyLabel'), value: 'requested' },
                { label: t('chart.shippedQtyLabel'), value: 'shipped' },
              ]}
            />
          </Group>

          <SimpleGrid
            cols={{ base: 1, lg: 2 }}
            spacing="lg"
          >
            <BarChartCard
              data={chartData}
              isFetching={isFetching}
              chartLabel={chartLabel}
            />

            <LineChartCard
              data={chartData}
              isFetching={isFetching}
              chartLabel={chartLabel}
            />
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
};

export default StatisticsPage;
