import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteBrandMutation } from '../../../store/api/api';

const DeleteBrandModal = ({ opened, onClose, brand }) => {
  const [deleteBrand, { isLoading }] = useDeleteBrandMutation();

  const handleDelete = async () => {
    try {
      await deleteBrand(brand.name).unwrap();
      toast.success(`Brand "${brand.name}" deleted`);
      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete brand');
    }
  };

  if (!brand) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      centered
      padding={{ base: 'md', sm: 'lg' }}
      size={{ base: '95%', sm: 400 }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        Are you sure you want to delete brand <b>{brand.name}</b>? This action cannot be
        undone.
      </Text>
      <Group
        justify="flex-end"
        gap={{ base: 'sm', sm: 'md' }}
      >
        <Button
          variant="light"
          color="gray"
          onClick={onClose}
          disabled={isLoading}
          w={{ base: '100%', sm: 'auto' }}
        >
          Cancel
        </Button>
        <Button
          color="red"
          onClick={handleDelete}
          loading={isLoading}
          w={{ base: '100%', sm: 'auto' }}
        >
          Delete Brand
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteBrandModal;
