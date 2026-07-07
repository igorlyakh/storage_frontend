import { Badge, Button, Group, List, Modal, Stack, Text, ThemeIcon } from '@mantine/core';
import { TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

const CLOSE_DELAY_SECONDS = 5;

const LowStockModal = ({ opened, onClose, products = [] }) => {
  const [secondsLeft, setSecondsLeft] = useState(CLOSE_DELAY_SECONDS);

  useEffect(() => {
    if (!opened || secondsLeft === 0) return;

    const timer = setTimeout(() => {
      setSecondsLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearTimeout(timer);
  }, [opened, secondsLeft]);

  const canClose = secondsLeft === 0;

  return (
    <Modal
      opened={opened}
      onClose={() => canClose && onClose()}
      title={
        <Group gap="xs">
          <ThemeIcon
            color="yellow"
            variant="light"
            radius="xl"
          >
            <TriangleAlert size={16} />
          </ThemeIcon>
          <Text fw={700}>Low Stock Warning</Text>
        </Group>
      }
      centered
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
      size="md"
    >
      <Stack gap="md">
        <Text size="sm">
          The following products in your scope have <b>20 or fewer</b> items in stock:
        </Text>

        <List
          spacing="xs"
          size="sm"
          center
        >
          {products.map(product => (
            <List.Item key={product.id}>
              <Group
                justify="space-between"
                wrap="nowrap"
              >
                <Text
                  size="sm"
                  fw={500}
                >
                  {product.name}
                </Text>
                <Badge
                  color="red"
                  variant="light"
                >
                  {product.stock?.quantity ?? 0} left
                </Badge>
              </Group>
            </List.Item>
          ))}
        </List>

        <Button
          fullWidth
          onClick={onClose}
          disabled={!canClose}
          color={canClose ? 'blue' : 'gray'}
        >
          {canClose ? 'Close' : `Please wait (${secondsLeft})`}
        </Button>
      </Stack>
    </Modal>
  );
};

export default LowStockModal;
