import { Button, Group, Modal, NumberInput, Stack } from '@mantine/core';

const StockOperationModal = ({
  stockOpData,
  stockQuantity,
  onQuantityChange,
  onClose,
  onConfirm,
  isLoading,
}) => {
  return (
    <Modal
      opened={!!stockOpData}
      onClose={onClose}
      title={
        stockOpData
          ? `${stockOpData.type === 'increase' ? 'Increase' : 'Decrease'} Stock: ${stockOpData.product?.name}`
          : ''
      }
      centered
    >
      <Stack>
        <NumberInput
          label="Quantity"
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
            Cancel
          </Button>
          <Button
            color={stockOpData?.type === 'increase' ? 'green' : 'red'}
            onClick={onConfirm}
            loading={isLoading}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default StockOperationModal;
