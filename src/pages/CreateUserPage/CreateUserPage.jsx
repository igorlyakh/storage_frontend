import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateUserMutation, useGetAllStoresQuery } from '../../store/api/api';

const CreateUserPage = () => {
  const { data: stores = [], isLoading: isStoresLoading } = useGetAllStoresQuery();
  const [createUser, { isLoading: isSubmitting }] = useCreateUserMutation();

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
      name: 'password',
      type: 'password',
      label: 'Password',
      placeholder: '••••••••',
      rules: {
        required: 'Password is required',
        minLength: { value: 6, message: 'At least 6 chars' },
      },
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
      options: [
        { value: 'NCG', label: 'NCG' },
        { value: 'ADMINISTRATIVE', label: 'ADMINISTRATIVE' },
      ],
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
      ...data,
      storeId: data.role === 'STORE' ? Number(data.storeId) : null,
      adminScopes: data.role === 'ADMIN' ? data.adminScopes : [],
    };

    try {
      await createUser(payload).unwrap();
      toast.success('User created!');
      reset();
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to create user');
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title="Create New User"
        submitLabel="Create User"
        fields={fields}
        gridCols={2}
        paperWidth={{ base: '100%', sm: 500, md: 600 }}
        defaultValues={{
          username: '',
          password: '',
          role: 'STORE',
          storeId: '',
          adminScopes: [],
        }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateUserPage;
