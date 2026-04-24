import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDeleteUserMutation } from '../../store/api/api';

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
    >
      <Text
        size="sm"
        mb="lg"
      >
        Are you sure you want to delete user <b>{user.username}</b>? This action cannot be
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
          Delete User
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteUserModal;
