import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteSupplierMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const DeleteSupplierModal = ({ opened, onClose, supplier }) => {
  const { t } = useTranslation('suppliers');
  const [deleteSupplier, { isLoading }] = useDeleteSupplierMutation();

  const handleDelete = async () => {
    try {
      await deleteSupplier(supplier.id).unwrap();
      toast.success(t('delete.deleted', { name: supplier.name }));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'delete.deleteFailed'));
    }
  };

  if (!supplier) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('common:actions.confirmDeletion')}
      centered
      padding={{ base: 'md', sm: 'lg' }}
      size={{ base: '95%', sm: 400 }}
    >
      <Text
        size="sm"
        mb="lg"
      >
        <Trans
          t={t}
          i18nKey="delete.confirmText"
          values={{ name: supplier.name }}
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
          {t('delete.delete')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteSupplierModal;
