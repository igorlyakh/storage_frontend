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
import { useTranslation } from 'react-i18next';

export const ConfirmOrderModal = ({
  itemsToOrder,
  customRequest,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation('orders');
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
          {t('confirmModal.reviewTitle')}
        </Text>
      </Group>

      <Text
        size="sm"
        c="dimmed"
        mb="md"
      >
        {t('confirmModal.reviewDescription')}
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
                  {item.orderQuantity} {t('confirmModal.pcs')}
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
                  {t('confirmModal.customRequestLabel')}
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
            {t('confirmModal.confirmCheckbox')}
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
          {t('confirmModal.returnToEditing')}
        </Button>
        <Button
          color="blue"
          disabled={!isChecked}
          onClick={onConfirm}
          leftSection={<Check size={16} />}
        >
          {t('confirmModal.submitOrder')}
        </Button>
      </Group>
    </Box>
  );
};
