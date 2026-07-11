import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteWarehouseMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const DeleteWarehouseModal = ({ opened, onClose, warehouse }) => {
  const { t } = useTranslation('warehouse');
  const [deleteWarehouse, { isLoading }] = useDeleteWarehouseMutation();

  const handleDelete = async () => {
    try {
      await deleteWarehouse(warehouse.id).unwrap();
      toast.success(t('management.delete.deleted', { name: warehouse.name }));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'management.delete.deleteFailed'));
    }
  };

  if (!warehouse) return null;

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
          i18nKey="management.delete.confirmText"
          values={{ name: warehouse.name }}
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
          {t('management.delete.delete')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteWarehouseModal;
