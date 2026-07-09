import { Button, Group, Modal, NumberInput, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

const StockOperationModal = ({
  stockOpData,
  stockQuantity,
  onQuantityChange,
  onClose,
  onConfirm,
  isLoading,
}) => {
  const { t } = useTranslation('warehouse');

  return (
    <Modal
      opened={!!stockOpData}
      onClose={onClose}
      title={
        stockOpData
          ? t(
              stockOpData.type === 'increase'
                ? 'stockModal.increaseTitle'
                : 'stockModal.decreaseTitle',
              { name: stockOpData.product?.name },
            )
          : ''
      }
      centered
    >
      <Stack>
        <NumberInput
          label={t('stockModal.quantity')}
          value={stockQuantity}
          onChange={val => onQuantityChange(val || 0)}
          min={1}
          data-autofocus
        />
        <Group justify="flex-end">
          <Button
            variant="default"
            onClick={onClose}
          >
            {t('stockModal.cancel')}
          </Button>
          <Button
            color={stockOpData?.type === 'increase' ? 'green' : 'red'}
            onClick={onConfirm}
            loading={isLoading}
          >
            {t('stockModal.confirm')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default StockOperationModal;
