import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  ScrollArea,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { Check, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export const ConfirmOrderModal = ({
  itemsToOrder,
  customRequest,
  onConfirm,
  onCancel,
}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <Box>
      <Group
        gap="sm"
        mb="md"
      >
        <ThemeIcon
          color="blue"
          size="lg"
          variant="light"
          radius="xl"
        >
          <ShoppingCart size={18} />
        </ThemeIcon>
        <Text
          fw={600}
          size="lg"
        >
          Review Your Order
        </Text>
      </Group>

      <Text
        size="sm"
        c="dimmed"
        mb="md"
      >
        Please carefully review the items you have selected before final submission.
      </Text>

      <Paper
        withBorder
        radius="md"
        bg="gray.0"
        mb="lg"
        overflow="hidden"
      >
        <ScrollArea
          type="auto"
          mah={300}
          offsetScrollbars
        >
          {itemsToOrder.map((item, index) => (
            <Box key={item.id}>
              <Group
                justify="space-between"
                py="xs"
                px="md"
              >
                <Text
                  size="sm"
                  fw={500}
                >
                  {item.name}
                </Text>
                <Text
                  size="sm"
                  fw={700}
                  c="blue.7"
                >
                  {item.orderQuantity} pcs
                </Text>
              </Group>
              {index < itemsToOrder.length - 1 && <Divider />}
            </Box>
          ))}

          {customRequest.trim() && (
            <>
              {itemsToOrder.length > 0 && <Divider />}
              <Box
                py="sm"
                px="md"
                bg="yellow.0"
              >
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="yellow.8"
                  mb={4}
                >
                  Custom Request
                </Text>
                <Text
                  size="sm"
                  fs="italic"
                  c="dark.7"
                >
                  {customRequest.trim()}
                </Text>
              </Box>
            </>
          )}
        </ScrollArea>
      </Paper>

      <Checkbox
        label={
          <Text
            size="sm"
            fw={500}
          >
            I have verified my order and I am ready to submit
          </Text>
        }
        checked={isChecked}
        onChange={event => setIsChecked(event.currentTarget.checked)}
        mb="xl"
        color="blue"
        size="md"
      />

      <Group
        justify="flex-end"
        gap="sm"
      >
        <Button
          variant="subtle"
          color="gray"
          onClick={onCancel}
        >
          Return to editing
        </Button>
        <Button
          color="blue"
          disabled={!isChecked}
          onClick={onConfirm}
          leftSection={<Check size={16} />}
        >
          Submit Order
        </Button>
      </Group>
    </Box>
  );
};
