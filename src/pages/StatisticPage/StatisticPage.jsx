import { Button, Center, Group, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { saveAs } from 'file-saver';
import { Download, Info } from 'lucide-react';
import { useState } from 'react';

import BarChartCard from '../../components/BarChartCard';
import LineChartCard from '../../components/LineChartCard';
import StatisticsFilters from '../../components/StatisticsFilters';

import {
  useExportExcelMutation,
  useGetAllProductsQuery,
  useGetAllStoresQuery,
  useGetStatisticsDataQuery,
} from '../../store/api/api';

const StatisticsPage = () => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [productId, setProductId] = useState(null);
  const [storeId, setStoreId] = useState(null);

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

  const chartLabel = productId ? 'Items Quantity Ordered' : 'Total Orders Count';

  const handleExportExcel = async () => {
    try {
      const blob = await exportExcel(queryParams).unwrap();

      const startDateStr = dateRange[0]
        ? dateRange[0].toLocaleDateString('ru-RU')
        : 'All';
      const endDateStr = dateRange[1] ? dateRange[1].toLocaleDateString('ru-RU') : 'All';

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
        <Title order={2}>Global Statistics</Title>

        <Button
          leftSection={<Download size={18} />}
          onClick={handleExportExcel}
          variant="light"
          color="green"
          loading={isExporting}
          disabled={!isDateSelected || isFetching || statsData.length === 0}
        >
          Export to Excel
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
              Please select a date range to view statistics.
            </Text>
          </Stack>
        </Center>
      ) : (
        <SimpleGrid
          cols={{ base: 1, lg: 2 }}
          spacing="lg"
          mt="md"
        >
          <BarChartCard
            data={statsData}
            isFetching={isFetching}
            chartLabel={chartLabel}
          />

          <LineChartCard
            data={statsData}
            isFetching={isFetching}
            chartLabel={chartLabel}
          />
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default StatisticsPage;
