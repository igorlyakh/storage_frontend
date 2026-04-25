import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteBrandMutation } from '../../store/api/api';

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
    >
      <Text
        size="sm"
        mb="lg"
      >
        Are you sure you want to delete brand <b>{brand.name}</b>? This action cannot be
        undone.
      </Text>
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
          color="red"
          onClick={handleDelete}
          loading={isLoading}
        >
          Delete Brand
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteBrandModal;
