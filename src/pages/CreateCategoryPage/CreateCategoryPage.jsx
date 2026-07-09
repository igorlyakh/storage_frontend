import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateCategoryMutation } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateCategoryPage = () => {
  const { t } = useTranslation('categories');
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: t('create.nameLabel'),
      placeholder: t('create.namePlaceholder'),
      rules: {
        required: t('create.nameRequired'),
        minLength: { value: 2, message: t('create.minLength') },
      },
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      await createCategory(data).unwrap();
      toast.success(t('create.created', { name: data.name }));
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
        defaultValues={{ name: '' }}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CreateCategoryPage;
