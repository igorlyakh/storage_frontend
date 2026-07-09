import {
  Button,
  Card,
  Center,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { saveAs } from 'file-saver';
import { CheckCircle2, Download, Info, ListChecks, Package } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import BarChartCard from '../../components/BarChartCard';
import LineChartCard from '../../components/LineChartCard';
import StatTile from '../../components/ui/StatTile';
import { productTags } from '../../constants/productTags';
import {
  useExportRequestsExcelMutation,
  useGetAllProductsQuery,
  useGetRequestsStatisticsDataQuery,
} from '../../store/api/api';

const RequestsStatisticPage = () => {
  const { t } = useTranslation('statistics');
  const [dateRange, setDateRange] = useState([null, null]);
  const [productId, setProductId] = useState(null);
  const [category, setCategory] = useState(null);

  const [exportRequestsExcel, { isLoading: isExporting }] =
    useExportRequestsExcelMutation();

  const setToday = () => {
    const today = new Date();
    setDateRange([today, today]);
  };

  const setThisMonth = () => {
    const today = new Date();
    setDateRange([
      new Date(today.getFullYear(), today.getMonth(), 1),
      new Date(today.getFullYear(), today.getMonth() + 1, 0),
    ]);
  };

  const setThisYear = () => {
    const today = new Date();
    setDateRange([new Date(today.getFullYear(), 0, 1), new Date(today.getFullYear(), 11, 31)]);
  };

  let finalStartDate;
  let finalEndDate;

  if (dateRange && dateRange[0]) {
    const s = new Date(dateRange[0]);
    s.setHours(0, 0, 0, 0);
    finalStartDate = s.toISOString();

    const e = new Date(dateRange[1] || dateRange[0]);
    e.setHours(23, 59, 59, 999);
    finalEndDate = e.toISOString();
  }

  const isDateSelected = !!finalStartDate;

  const queryParams = {
    startDate: finalStartDate,
    endDate: finalEndDate,
    productId: productId || undefined,
    category: category || undefined,
  };

  const { data: products = [] } = useGetAllProductsQuery();
  const productOptions = products.map(p => ({ value: p.id, label: p.name }));
  const categoryOptions = productTags.map(tag => ({ value: tag, label: tag }));

  const { data: statsData = [], isFetching } = useGetRequestsStatisticsDataQuery(
    queryParams,
    { skip: !isDateSelected },
  );

  const totals = useMemo(
    () =>
      statsData.reduce(
        (acc, row) => {
          acc.requests += row.requestCount ?? 0;
          acc.completed += row.completedCount ?? 0;
          acc.quantity += row.quantity ?? 0;
          return acc;
        },
        { requests: 0, completed: 0, quantity: 0 },
      ),
    [statsData],
  );

  const completionRate =
    totals.requests > 0 ? Math.round((totals.completed / totals.requests) * 100) : null;

  const chartLabel = productId
    ? t('chart.quantityRequested')
    : t('chart.totalRequestsCount');

  const chartData = useMemo(
    () =>
      statsData.map(row => ({
        ...row,
        value: productId ? row.quantity : row.requestCount,
      })),
    [statsData, productId],
  );

  const handleExportExcel = async () => {
    try {
      const blob = await exportRequestsExcel(queryParams).unwrap();

      const startDateStr = dateRange[0]
        ? dateRange[0].toLocaleDateString('ru-RU')
        : t('exportFallbackAll');
      const endDateStr = dateRange[1]
        ? dateRange[1].toLocaleDateString('ru-RU')
        : t('exportFallbackAll');

      saveAs(blob, `Requests_Statistics_${startDateStr}_to_${endDateStr}.xlsx`);
    } catch (error) {
      console.error('Excel export error:', error);
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
        <Title order={2}>{t('requestsTitle')}</Title>

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

      <Card
        withBorder
        shadow="sm"
        radius="md"
        p={{ base: 'sm', sm: 'md' }}
      >
        <Stack gap="sm">
          <Group
            justify="space-between"
            align="flex-end"
          >
            <DatePickerInput
              type="range"
              label={t('filters.dateRangeLabel')}
              placeholder={t('filters.dateRangePlaceholder')}
              value={dateRange}
              onChange={setDateRange}
              clearable
              size={{ base: 'md', sm: 'sm' }}
              style={{ flexGrow: 1, maxWidth: 400 }}
              required
              error={!dateRange?.[0] ? t('filters.dateRangeRequired') : null}
            />

            <Group
              gap="xs"
              mt={{ base: 'xs', sm: 0 }}
            >
              <Text
                size="sm"
                fw={500}
                c="dimmed"
                mr="xs"
              >
                {t('filters.quickSelect')}
              </Text>
              <Button
                variant="light"
                size="xs"
                onClick={setToday}
              >
                {t('filters.today')}
              </Button>
              <Button
                variant="light"
                size="xs"
                onClick={setThisMonth}
              >
                {t('filters.thisMonth')}
              </Button>
              <Button
                variant="light"
                size="xs"
                onClick={setThisYear}
              >
                {t('filters.thisYear')}
              </Button>
            </Group>
          </Group>

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing={{ base: 'sm', sm: 'md' }}
            mt="sm"
          >
            <Select
              label={t('filters.scopeFilter')}
              placeholder={t('filters.allScopes')}
              data={categoryOptions}
              value={category}
              onChange={setCategory}
              searchable
              clearable
              size={{ base: 'md', sm: 'sm' }}
            />

            <Select
              label={t('filters.productFilter')}
              placeholder={t('filters.allProducts')}
              data={productOptions}
              value={productId}
              onChange={setProductId}
              searchable
              clearable
              size={{ base: 'md', sm: 'sm' }}
            />
          </SimpleGrid>
        </Stack>
      </Card>

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
            cols={{ base: 1, sm: 3 }}
            spacing="md"
          >
            <StatTile
              label={t('metrics.requests')}
              value={totals.requests}
              icon={ListChecks}
              color="blue"
            />
            <StatTile
              label={t('metrics.quantity')}
              value={totals.quantity}
              icon={Package}
              color="grape"
            />
            <StatTile
              label={t('metrics.completionRate')}
              value={completionRate === null ? '—' : `${completionRate}%`}
              icon={CheckCircle2}
              color={
                completionRate === null || completionRate >= 90
                  ? 'teal'
                  : completionRate >= 60
                    ? 'yellow'
                    : 'red'
              }
            />
          </SimpleGrid>

          <SimpleGrid
            cols={{ base: 1, lg: 2 }}
            spacing="lg"
          >
            <BarChartCard
              data={chartData}
              isFetching={isFetching}
              chartLabel={chartLabel}
              groupKey="categoryName"
              title={t('chart.totalByScope')}
            />

            <LineChartCard
              data={chartData}
              isFetching={isFetching}
              chartLabel={chartLabel}
              groupKey="categoryName"
            />
          </SimpleGrid>
        </>
      )}
    </Stack>
  );
};

export default RequestsStatisticPage;
