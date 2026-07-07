import { Badge, Box, Button, Group } from '@mantine/core';

const SendRequestBar = ({ totalItemsToOrder, isSending, onSend }) => {
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
            Selected products: {totalItemsToOrder}
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
        Send Request
      </Button>
    </Group>
  );
};

export default SendRequestBar;
