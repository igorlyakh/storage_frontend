import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteStoreMutation } from '../../../store/api/api';

const DeleteStoreModal = ({ opened, onClose, store }) => {
  const [deleteStore, { isLoading }] = useDeleteStoreMutation();

  const handleDelete = async () => {
    try {
      await deleteStore(store.id).unwrap();
      toast.success(`Store "${store.name}" deleted`);
      onClose();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to delete store');
    }
  };

  if (!store) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      centered
      size={{ base: '95%', sm: 420 }}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        Are you sure you want to delete store <b>{store.name}</b>? This will{' '}
        <b>permanently delete the entire order history</b> of this store. This action
        cannot be undone.
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
          Delete Store
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteStoreModal;
