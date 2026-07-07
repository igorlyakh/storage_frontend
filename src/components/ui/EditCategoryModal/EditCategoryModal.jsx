import { Button, Group, Modal, Stack, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateCategoryMutation } from '../../../store/api/api';

const EditCategoryModal = ({ opened, onClose, category }) => {
  const [updateCategory, { isLoading }] = useUpdateCategoryMutation();
  const [name, setName] = useState(category?.name || '');

  const handleSubmit = async () => {
    if (!name.trim()) {
      return toast.error('Category name is required');
    }
    try {
      await updateCategory({ id: category.id, name: name.trim() }).unwrap();
      toast.success('Category updated!');
      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to update category');
    }
  };

  if (!category) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit category: ${category.name}`}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label="Category Name"
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

export default EditCategoryModal;
