import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateBrandMutation } from '../../../store/api/api';

const EditBrandModal = ({ opened, onClose, brand }) => {
  const [updateBrand, { isLoading }] = useUpdateBrandMutation();
  const [name, setName] = useState(brand?.name || '');

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error('Brand name is required');
    }
    try {
      await updateBrand({ id: brand.id, name: name.trim() }).unwrap();
      toast.success('Brand updated!');
      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update brand');
    }
  };

  if (!brand) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit brand: ${brand.name}`}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label="Brand Name"
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

export default EditBrandModal;
