import { Button, Group, SimpleGrid, Stack, Title } from '@mantine/core';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import { Download } from 'lucide-react';
import { useRef, useState } from 'react';

import MonthlyChartCard from '../../components/MonthlyChartCard';
import StatisticsFilters from '../../components/StatisticsFilters';
import YearlyChartCard from '../../components/YearlyChartCard';
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

      <StatisticsFilters
        year={year}
        setYear={setYear}
        month={month}
        setMonth={setMonth}
        productId={productId}
        setProductId={setProductId}
        productOptions={productOptions}
      />

      <SimpleGrid
        cols={{ base: 1, lg: 2 }}
        spacing="lg"
        mt="md"
      >
        <MonthlyChartCard
          ref={monthlyChartRef}
          data={monthlyData}
          isFetching={isMonthlyFetching}
          chartLabel={chartLabel}
        />

        <YearlyChartCard
          ref={yearlyChartRef}
          data={yearlyData}
          isFetching={isYearlyFetching}
          chartLabel={chartLabel}
        />
      </SimpleGrid>
    </Stack>
  );
};

export default StatisticsPage;
