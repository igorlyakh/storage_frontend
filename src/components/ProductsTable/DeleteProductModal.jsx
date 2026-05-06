import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteProductMutation } from '../../store/api/api';

const DeleteProductModal = ({ opened, onClose, product }) => {
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: product.id }).unwrap();
      toast.success('Product deleted');
      onClose();
    } catch {
      toast.error('Failed to delete product');
    }
  };

  if (!product) return null;

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
        Are you sure you want to delete <b>{product.name}</b>?
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
          Delete
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteProductModal;
