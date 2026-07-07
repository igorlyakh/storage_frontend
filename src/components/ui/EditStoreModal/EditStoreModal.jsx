import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useGetAllBrandsQuery, useUpdateStoreMutation } from '../../../store/api/api';

const EditStoreModal = ({ opened, onClose, store }) => {
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
      return toast.error('Store name is required');
    }
    if (!brandId) {
      return toast.error('Brand is required');
    }

    try {
      await updateStore({ id: store.id, name: name.trim(), brandId }).unwrap();
      toast.success('Store updated!');
      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update store');
    }
  };

  if (!store) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit store: ${store.name}`}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label="Store Name"
          value={name}
          onChange={e => setName(e.currentTarget.value)}
        />
        <Select
          label="Brand"
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
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
          >
            Save Changes
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default EditStoreModal;
