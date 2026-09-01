import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../../components/ui/DynamicForm';
import { productTags } from '../../constants/productTags';
import { useCreateUserMutation, useGetAllStoresQuery } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateUserPage = () => {
  const { t } = useTranslation('users');
  const { data: stores = [], isLoading: isStoresLoading } = useGetAllStoresQuery();
  const [createUser, { isLoading: isSubmitting }] = useCreateUserMutation();

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
      name: 'password',
      type: 'password',
      label: t('create.passwordLabel'),
      placeholder: '••••••••',
      rules: {
        required: t('create.passwordRequired'),
        minLength: { value: 6, message: t('create.passwordMinLength') },
      },
    },
    {
      name: 'role',
      type: 'select',
      label: t('create.roleLabel'),
      options: [
        { value: 'ADMIN', label: 'ADMIN' },
        { value: 'WAREHOUSE', label: 'WAREHOUSE' },
        { value: 'STORE', label: 'STORE' },
        { value: 'DRIVER', label: 'DRIVER' },
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
      ...data,
      storeId: data.role === 'STORE' ? Number(data.storeId) : null,
      adminScopes: data.role === 'ADMIN' ? data.adminScopes : [],
    };

    try {
      await createUser(payload).unwrap();
      toast.success(t('create.created'));
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'create.createFailed'));
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title={t('create.title')}
        submitLabel={t('create.submit')}
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
