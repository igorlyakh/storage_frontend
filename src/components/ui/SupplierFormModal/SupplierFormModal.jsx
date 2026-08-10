import { Modal } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';
import DynamicForm from '../DynamicForm';

const SupplierFormModal = ({ opened, onClose, supplier }) => {
  const { t } = useTranslation('suppliers');
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const isEdit = !!supplier;

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: t('form.nameLabel'),
      placeholder: t('form.namePlaceholder'),
      rules: { required: t('form.nameRequired') },
    },
    {
      name: 'contactPerson',
      type: 'text',
      label: t('form.contactPersonLabel'),
      placeholder: t('form.contactPersonPlaceholder'),
    },
    {
      name: 'phone',
      type: 'text',
      label: t('form.phoneLabel'),
      placeholder: t('form.phonePlaceholder'),
    },
    {
      name: 'notes',
      type: 'text',
      label: t('form.notesLabel'),
      placeholder: t('form.notesPlaceholder'),
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      if (isEdit) {
        await updateSupplier({ id: supplier.id, ...data }).unwrap();
        toast.success(t('form.updated'));
      } else {
        await createSupplier(data).unwrap();
        toast.success(t('form.created'));
        reset();
      }
      onClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(t, error, isEdit ? 'form.updateFailed' : 'form.createFailed'),
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={isEdit ? t('form.editTitle') : t('form.createTitle')}
      centered
      size={{ base: '95%', sm: 500 }}
      padding={0}
    >
      <DynamicForm
        key={supplier?.id || 'create'}
        title=""
        submitLabel={isEdit ? t('form.saveChanges') : t('form.submit')}
        fields={fields}
        gridCols={1}
        paperWidth="100%"
        defaultValues={{
          name: supplier?.name || '',
          contactPerson: supplier?.contactPerson || '',
          phone: supplier?.phone || '',
          notes: supplier?.notes || '',
        }}
        onSubmit={onSubmit}
        isLoading={isCreating || isUpdating}
      />
    </Modal>
  );
};

export default SupplierFormModal;
