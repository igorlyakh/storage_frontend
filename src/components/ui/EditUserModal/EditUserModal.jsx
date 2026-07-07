import { Modal } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../DynamicForm';
import { productTags } from '../../../constants/productTags';
import { useGetAllStoresQuery, useUpdateUserMutation } from '../../../store/api/api';

const EditUserModal = ({ opened, onClose, user }) => {
  const { data: stores = [], isLoading: isStoresLoading } = useGetAllStoresQuery();
  const [updateUser, { isLoading: isSubmitting }] = useUpdateUserMutation();

  if (!user) return null;

  const storeOptions = stores.map(store => ({
    value: String(store.id),
    label: store.name || `Store #${store.id}`,
  }));

  const fields = [
    {
      name: 'username',
      type: 'text',
      label: 'Username',
      placeholder: 'Enter username',
      rules: { required: 'Username is required' },
    },
    {
      name: 'role',
      type: 'select',
      label: 'Access Role',
      options: [
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'WAREHOUSE', label: 'WAREHOUSE' },
        { value: 'STORE', label: 'STORE' },
      ],
    },
    {
      name: 'adminScopes',
      type: 'multiselect',
      label: 'Admin Scopes',
      placeholder: '-- Choose scopes --',
      rules: { required: 'Scopes are required for ADMIN role' },
      options: productTags.map(tag => ({ value: tag, label: tag })),
      condition: values => values.role === 'ADMIN',
    },
    {
      name: 'storeId',
      type: 'select',
      label: 'Assigned Store',
      placeholder: '-- Choose --',
      options: storeOptions,
      loading: isStoresLoading,
      rules: { required: 'Store is required for STORE role' },
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
      toast.success('User updated!');
      reset();
      onClose();
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to update user');
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Edit user: ${user.username}`}
      centered
      size={{ base: '95%', sm: 500 }}
      padding={0}
    >
      <DynamicForm
        key={user.id}
        title=""
        submitLabel="Save Changes"
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
