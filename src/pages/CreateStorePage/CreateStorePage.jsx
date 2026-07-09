import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateStoreMutation, useGetAllBrandsQuery } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateStorePage = () => {
  const { t } = useTranslation('stores');
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const [createStore, { isLoading: isSubmitting }] = useCreateStoreMutation();

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: t('create.nameLabel'),
      placeholder: t('create.namePlaceholder'),
      rules: {
        required: t('create.nameRequired'),
        minLength: { value: 3, message: t('create.nameMinLength') },
      },
    },
    {
      name: 'brandId',
      type: 'select',
      label: t('create.brandLabel'),
      placeholder: isBrandsLoading ? t('create.loadingBrands') : t('create.selectBrand'),
      options: brandOptions,
      loading: isBrandsLoading,
      searchable: true,
      rules: { required: t('create.brandRequired') },
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      await createStore(data).unwrap();
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
        paperWidth={{ base: '100%', sm: 450 }}
        fields={fields}
        defaultValues={{ name: '', brandId: '' }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateStorePage;
