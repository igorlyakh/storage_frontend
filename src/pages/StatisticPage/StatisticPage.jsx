import { BarChart, LineChart } from '@mantine/charts';
import {
  Box,
  Button,
  Card,
  Group,
  LoadingOverlay,
  Select,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Download } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';

import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';

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

  const [isExporting, setIsExporting] = useState(false);

  const monthlyChartRef = useRef(null);
  const yearlyChartRef = useRef(null);

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

  const yearlySeries = useMemo(() => {
    if (yearlyData.length === 0) return [];
    const stores = Object.keys(yearlyData[0]).filter(key => key !== 'month');
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
  }, [yearlyData]);

  const chartLabel = productId ? 'Items Quantity Ordered' : 'Total Orders Count';

  const handleExportExcel = async () => {
    setIsExporting(true);
    try {
      const workbook = new ExcelJS.Workbook();

      const monthlySheet = workbook.addWorksheet(`Monthly (${month}-${year})`);

      monthlySheet.columns = [
        { header: 'Store Name', key: 'storeName', width: 30 },
        { header: chartLabel, key: 'value', width: 25 },
      ];
      monthlySheet.addRows(monthlyData);

      if (monthlyChartRef.current) {
        const canvas = await html2canvas(monthlyChartRef.current, { scale: 2 });
        const imageId = workbook.addImage({
          base64: canvas.toDataURL('image/png'),
          extension: 'png',
        });
        monthlySheet.addImage(imageId, {
          tl: { col: 3, row: 1 },
          ext: { width: 600, height: 300 },
        });
      }

      const yearlySheet = workbook.addWorksheet(`Yearly (${year})`);

      if (yearlyData.length > 0) {
        const columns = Object.keys(yearlyData[0]).map(key => ({
          header: key === 'month' ? 'Month' : key,
          key: key,
          width: 15,
        }));
        yearlySheet.columns = columns;
        yearlySheet.addRows(yearlyData);
      }

      if (yearlyChartRef.current) {
        const canvas = await html2canvas(yearlyChartRef.current, { scale: 2 });
        const imageId = workbook.addImage({
          base64: canvas.toDataURL('image/png'),
          extension: 'png',
        });
        yearlySheet.addImage(imageId, {
          tl: { col: 0, row: 15 },
          ext: { width: 700, height: 350 },
        });
      }

      const buffer = await workbook.xlsx.writeBuffer();
      const productName = productId
        ? products.find(p => p.id === productId)?.name.replace(/[^a-z0-9]/gi, '_')
        : 'All_Orders';

      saveAs(new Blob([buffer]), `Statistics_${productName}_${month}-${year}.xlsx`);
    } catch (error) {
      console.error(error);
    } finally {
      setIsExporting(false);
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
          disabled={isMonthlyFetching || isYearlyFetching}
        >
          Export to Excel
        </Button>
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
            placeholder="All Products (Orders count)"
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
            ref={monthlyChartRef}
            bg="white"
          >
            <LoadingOverlay
              visible={isMonthlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {monthlyData.length > 0 ? (
              <BarChart
                h={300}
                data={monthlyData}
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
            ref={yearlyChartRef}
            bg="white"
          >
            <LoadingOverlay
              visible={isYearlyFetching}
              zIndex={1000}
              overlayProps={{ blur: 2 }}
            />
            {yearlyData.length > 0 && yearlySeries.length > 0 ? (
              <LineChart
                h={300}
                data={yearlyData}
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
      </SimpleGrid>
    </Stack>
  );
};

export default StatisticsPage;
