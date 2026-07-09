import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useUpdateBrandMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const EditBrandModal = ({ opened, onClose, brand }) => {
  const { t } = useTranslation('brands');
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();
  const [name, setName] = useState(brand?.name || '');

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error(t('edit.nameRequired'));
    }
    try {
      await updateBrand({ id: brand.id, name: name.trim() }).unwrap();
      toast.success(t('edit.updated'));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'edit.updateFailed'));
    }
  };

  if (!brand) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('edit.title', { name: brand.name })}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label={t('edit.nameLabel')}
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

export default EditBrandModal;
