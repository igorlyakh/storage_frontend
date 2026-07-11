import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUpdateWarehouseMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const EditWarehouseModal = ({ opened, onClose, warehouse }) => {
  const { t } = useTranslation('warehouse');
  const [updateWarehouse, { isLoading }] = useUpdateWarehouseMutation();
  const [name, setName] = useState(warehouse?.name || '');

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error(t('management.nameRequired'));
    }
    try {
      await updateWarehouse({ id: warehouse.id, name: name.trim() }).unwrap();
      toast.success(t('management.edit.updated'));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'management.edit.updateFailed'));
    }
  };

  if (!warehouse) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('management.edit.title', { name: warehouse.name })}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label={t('management.edit.nameLabel')}
          value={name}
          onChange={e => setName(e.currentTarget.value)}
          data-autofocus
        />
        <Group justify="flex-end">
          <Button
            variant="light"
            color="gray"
            onClick={onClose}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
          >
            {t('common:actions.saveChanges')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditWarehouseModal;
