import { Badge, Box, Button, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const SendRequestBar = ({ totalItemsToOrder, isSending, onSend }) => {
  const { t } = useTranslation('warehouse');

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
      <Button
        onClick={onSend}
        disabled={isSending || totalItemsToOrder === 0}
        color={totalItemsToOrder > 0 ? 'green' : 'gray'}
        loading={isSending}
        w={{ base: '100%', sm: 'auto' }}
      >
        {t('sendRequestBar.sendRequest')}
      </Button>
    </Group>
  );
};

export default SendRequestBar;
