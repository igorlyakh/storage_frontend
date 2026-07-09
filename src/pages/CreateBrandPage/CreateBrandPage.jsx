import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateBrandMutation } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateBrandPage = () => {
  const { t } = useTranslation('brands');
  const [createBrand, { isLoading }] = useCreateBrandMutation();

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
      await createBrand(data.name).unwrap();
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

export default CreateBrandPage;
