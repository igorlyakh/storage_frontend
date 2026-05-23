import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteUserMutation } from '../../../store/api/api';

const DeleteUserModal = ({ opened, onClose, user }) => {
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      toast.success('User deleted successfully');
      onClose();
    } catch {
      toast.error('Failed to delete user');
    }
  };

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Confirm Deletion"
      centered
      size={{ base: '95%', sm: 400 }}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        Are you sure you want to delete user <b>{user.username}</b>? This action cannot be
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
          Delete User
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteUserModal;
