import { Button, Group, Modal, Text } from '@mantine/core';
import toast from 'react-hot-toast';
import { Trans, useTranslation } from 'react-i18next';
import { useDeleteProductMutation } from '../../store/api/api';

const DeleteProductModal = ({ opened, onClose, product }) => {
  const { t } = useTranslation('products');
  const [deleteProduct, { isLoading }] = useDeleteProductMutation();

  const handleDelete = async () => {
    try {
      await deleteProduct({ id: product.id }).unwrap();
      toast.success(t('deleteModal.deleted'));
      onClose();
    } catch {
      toast.error(t('deleteModal.deleteFailed'));
    }
  };

  if (!product) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('deleteModal.title')}
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
          values={{ name: product.name }}
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
          {t('common:actions.delete')}
        </Button>
      </Group>
    </Modal>
  );
};

export default DeleteProductModal;
