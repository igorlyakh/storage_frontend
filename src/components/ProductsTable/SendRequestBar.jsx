import { Badge, Box, Button, Group, Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';

import { EXTERNAL_SOURCE } from '../../constants/warehouseSource';

const SendRequestBar = ({
  totalItemsToOrder,
  isSending,
  onSend,
  warehouses = [],
  sourceWarehouseId,
  onSourceChange,
}) => {
  const { t } = useTranslation('warehouse');

  const sourceOptions = [
    { value: EXTERNAL_SOURCE, label: t('sendRequestBar.externalSupplier') },
    ...warehouses
      .filter(w => !w.isDefault)
      .map(w => ({ value: w.id, label: w.name })),
  ];

  return (
    <Group
      justify="space-between"
      mb="md"
      align="center"
      gap="sm"
    >
      <Box w={{ base: '100%', sm: 'auto' }}>
        {totalItemsToOrder > 0 && (
          <Badge
            color="green"
            size="lg"
            variant="light"
            w={{ base: '100%', sm: 'auto' }}
          >
            {t('sendRequestBar.selectedProducts', { count: totalItemsToOrder })}
          </Badge>
        )}
      </Box>
      <Group
        gap="sm"
        w={{ base: '100%', sm: 'auto' }}
      >
        <Select
          data={sourceOptions}
          value={sourceWarehouseId}
          onChange={value => onSourceChange(value || EXTERNAL_SOURCE)}
          label={t('sendRequestBar.sourceLabel')}
          allowDeselect={false}
          size="sm"
          w={{ base: '100%', sm: 220 }}
        />
        <Button
          onClick={onSend}
          disabled={isSending || totalItemsToOrder === 0}
          color={totalItemsToOrder > 0 ? 'green' : 'gray'}
          loading={isSending}
          w={{ base: '100%', sm: 'auto' }}
          style={{ alignSelf: 'flex-end' }}
        >
          {t('sendRequestBar.sendRequest')}
        </Button>
      </Group>
    </Group>
  );
};

export default SendRequestBar;
