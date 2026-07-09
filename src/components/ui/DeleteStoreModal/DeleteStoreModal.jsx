import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteStoreMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const DeleteStoreModal = ({ opened, onClose, store }) => {
  const { t } = useTranslation('stores');
  const [deleteStore, { isLoading }] = useDeleteStoreMutation();

  const handleDelete = async () => {
    try {
      await deleteStore(store.id).unwrap();
      toast.success(t('deleteModal.deleted', { name: store.name }));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'deleteModal.deleteFailed'));
    }
  };

  if (!store) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('common:actions.confirmDeletion')}
      centered
      size={{ base: '95%', sm: 420 }}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        <Trans
          t={t}
          i18nKey="deleteModal.confirmText"
          values={{ name: store.name }}
          components={{ bold: <b />, bold2: <b /> }}
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
          {t('deleteModal.delete')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteStoreModal;
