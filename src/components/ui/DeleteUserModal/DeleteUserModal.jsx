import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteUserMutation } from '../../../store/api/api';

const DeleteUserModal = ({ opened, onClose, user }) => {
  const { t } = useTranslation('users');
  const [deleteUser, { isLoading }] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(user.id).unwrap();
      toast.success(t('deleteModal.deleted'));
      onClose();
    } catch {
      toast.error(t('deleteModal.deleteFailed'));
    }
  };

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('common:actions.confirmDeletion')}
      centered
      size={{ base: '95%', sm: 400 }}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        <Trans
          t={t}
          i18nKey="deleteModal.confirmText"
          values={{ username: user.username }}
          components={{ bold: <b /> }}
        />
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
          {t('common:actions.cancel')}
        </Button>
        <Button
          color="red"
          onClick={handleDelete}
          loading={isLoading}
          w={{ base: '100%', sm: 'auto' }}
        >
          {t('deleteModal.deleteUser')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteUserModal;
