import { Button, Group, Modal, NumberInput, Select, Stack, Text } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useTransferStockMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const TransferStockModal = ({ opened, onClose, product, fromWarehouseId, warehouses }) => {
  const { t } = useTranslation('warehouse');
  const [transferStock, { isLoading }] = useTransferStockMutation();
  const [toWarehouseId, setToWarehouseId] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const warehouseOptions = warehouses
    .filter(warehouse => warehouse.id !== fromWarehouseId)
    .map(warehouse => ({
      value: warehouse.id,
      label: warehouse.isDefault
        ? `${warehouse.name} (${t('stockModal.defaultWarehouse')})`
        : warehouse.name,
    }));

  const handleClose = () => {
    setToWarehouseId(null);
    setQuantity(1);
    onClose();
  };

  const handleSubmit = async () => {
    if (!toWarehouseId) {
      return toast.error(t('transferModal.destinationRequired'));
    }
    if (!quantity || quantity < 1) {
      return toast.error(t('transferModal.quantityRequired'));
    }

    try {
      await transferStock({
        id: product.id,
        quantity,
        fromWarehouseId,
        toWarehouseId,
      }).unwrap();
      toast.success(t('transferModal.transferred'));
      handleClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'transferModal.transferFailed'));
    }
  };

  if (!product) return null;

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={t('transferModal.title', { name: product.name })}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <Text
          size="sm"
          c="dimmed"
        >
          {t('transferModal.available', { count: product.quantity })}
        </Text>

        <Select
          label={t('transferModal.destinationLabel')}
          placeholder={t('transferModal.destinationPlaceholder')}
          data={warehouseOptions}
          value={toWarehouseId}
          onChange={setToWarehouseId}
          searchable
          data-autofocus
        />

        <NumberInput
          label={t('stockModal.quantity')}
          value={quantity}
          onChange={setQuantity}
          min={1}
          max={product.quantity}
        />

        <Group justify="flex-end">
          <Button
            variant="light"
            color="gray"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('stockModal.confirm')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default TransferStockModal;
