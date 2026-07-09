import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useGetAllBrandsQuery, useUpdateStoreMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const EditStoreModal = ({ opened, onClose, store }) => {
  const { t } = useTranslation('stores');
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const [updateStore, { isLoading }] = useUpdateStoreMutation();

  const [name, setName] = useState(store?.name || '');
  const [brandId, setBrandId] = useState(store?.brand ? String(store.brand.id) : null);

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error(t('edit.nameRequired'));
    }
    if (!brandId) {
      return toast.error(t('edit.brandRequired'));
    }

    try {
      await updateStore({ id: store.id, name: name.trim(), brandId }).unwrap();
      toast.success(t('edit.updated'));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'edit.updateFailed'));
    }
  };

  if (!store) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('edit.title', { name: store.name })}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label={t('edit.nameLabel')}
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
        <Select
          label={t('edit.brandLabel')}
          data={brandOptions}
          value={brandId}
          onChange={setBrandId}
          disabled={isBrandsLoading}
          searchable
          allowDeselect={false}
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

export default EditStoreModal;
