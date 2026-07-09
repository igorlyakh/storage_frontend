import { Button, Card, Group, Select, SimpleGrid, Stack, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';

const StatisticsFilters = ({
  dateRange,
  setDateRange,
  productId,
  setProductId,
  productOptions,
  storeId,
  setStoreId,
  storeOptions,
}) => {
  const { t } = useTranslation('statistics');

  const setToday = () => {
    const today = new Date();
    setDateRange([today, today]);
  };

  const setThisMonth = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    setDateRange([firstDay, lastDay]);
  };

  const setThisYear = () => {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), 0, 1);
    const lastDay = new Date(today.getFullYear(), 11, 31);
    setDateRange([firstDay, lastDay]);
  };

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'sm', sm: 'md' }}
    >
      <Stack spacing="sm">
        <Group
          position="apart"
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
            style={{ flexGrow: 1, maxWidth: '400px' }}
            required
            error={!dateRange?.[0] ? t('filters.dateRangeRequired') : null}
          />

          <Group
            spacing="xs"
            mt={{ base: 'xs', sm: 0 }}
          >
            <Text
              size="sm"
              weight={500}
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
            label={t('filters.storeFilter')}
            placeholder={t('filters.allStores')}
            data={storeOptions}
            value={storeId}
            onChange={setStoreId}
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
  );
};

export default StatisticsFilters;
