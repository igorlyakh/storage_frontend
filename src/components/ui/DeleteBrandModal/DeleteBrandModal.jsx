import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteBrandMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const DeleteBrandModal = ({ opened, onClose, brand }) => {
  const { t } = useTranslation('brands');
  const [deleteBrand, { isLoading }] = useDeleteBrandMutation();

  const handleDelete = async () => {
    try {
      await deleteBrand(brand.name).unwrap();
      toast.success(t('deleteModal.deleted', { name: brand.name }));
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'deleteModal.deleteFailed'));
    }
  };

  if (!brand) return null;

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
          i18nKey="deleteModal.confirmText"
          values={{ name: brand.name }}
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
          {t('deleteModal.delete')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteBrandModal;
