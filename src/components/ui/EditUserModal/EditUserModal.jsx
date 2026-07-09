import { Modal } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../DynamicForm';
import { productTags } from '../../../constants/productTags';
import { useGetAllStoresQuery, useUpdateUserMutation } from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const EditUserModal = ({ opened, onClose, user }) => {
  const { t } = useTranslation('users');
  const { data: stores = [], isLoading: isStoresLoading } = useGetAllStoresQuery();
  const [updateUser, { isLoading: isSubmitting }] = useUpdateUserMutation();

  if (!user) return null;

  const storeOptions = stores.map(store => ({
    value: String(store.id),
    label: store.name || t('storeFallback', { id: store.id }),
  }));

  const fields = [
    {
      name: 'username',
      type: 'text',
      label: t('create.usernameLabel'),
      placeholder: t('create.usernamePlaceholder'),
      rules: { required: t('create.usernameRequired') },
    },
    {
      name: 'role',
      type: 'select',
      label: t('create.roleLabel'),
      options: [
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'WAREHOUSE', label: 'WAREHOUSE' },
        { value: 'STORE', label: 'STORE' },
      ],
    },
    {
      name: 'adminScopes',
      type: 'multiselect',
      label: t('create.adminScopesLabel'),
      placeholder: t('create.chooseScopesPlaceholder'),
      rules: { required: t('create.scopesRequired') },
      options: productTags.map(tag => ({ value: tag, label: tag })),
      condition: values => values.role === 'ADMIN',
    },
    {
      name: 'storeId',
      type: 'select',
      label: t('create.assignedStoreLabel'),
      placeholder: t('create.choosePlaceholder'),
      options: storeOptions,
      loading: isStoresLoading,
      rules: { required: t('create.storeRequired') },
      condition: values => values.role === 'STORE',
    },
  ];

  const onSubmit = async (data, reset) => {
    const payload = {
      id: user.id,
      username: data.username,
      role: data.role,
      storeId: data.role === 'STORE' ? Number(data.storeId) : null,
      adminScopes: data.role === 'ADMIN' ? data.adminScopes : [],
    };

    try {
      await updateUser(payload).unwrap();
      toast.success(t('edit.updated'));
      reset();
      onClose();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'edit.updateFailed'));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('edit.title', { username: user.username })}
      centered
      size={{ base: '95%', sm: 500 }}
      padding={0}
    >
      <DynamicForm
        key={user.id}
        title=""
        submitLabel={t('edit.submit')}
        fields={fields}
        gridCols={1}
        paperWidth="100%"
        defaultValues={{
          username: user.username || '',
          role: user.role || 'STORE',
          storeId: user.storeId ? String(user.storeId) : user.store?.id ? String(user.store.id) : '',
          adminScopes: user.adminScopes || [],
        }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Modal>
  );
};

export default EditUserModal;
