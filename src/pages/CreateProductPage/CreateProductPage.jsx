import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DynamicForm from '../../components/ui/DynamicForm';
import { productTags } from '../../constants/productTags';
import {
  useAddProductMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
} from '../../store/api/api';
import { adminScopesSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

const CreateProductPage = () => {
  const { t } = useTranslation('products');
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const { data: productCategories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();
  const adminScopes = useSelector(adminScopesSelector);

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const categoriesOptions = productCategories.map(category => ({
    value: String(category.id),
    label: category.name,
  }));

  const availableTags = adminScopes?.length ? adminScopes : productTags;
  const tagOptions = availableTags.map(tag => ({ value: tag, label: tag }));
  const isSingleScope = availableTags.length === 1;

  const packageTypeOptions = [
    { value: 'PALLET', label: t('create.packageTypes.PALLET') },
    { value: 'BOX', label: t('create.packageTypes.BOX') },
    { value: 'PACKAGE', label: t('create.packageTypes.PACKAGE') },
  ];

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: t('create.nameLabel'),
      placeholder: t('create.namePlaceholder'),
      rules: { required: t('create.nameRequired') },
    },
    {
      name: 'article',
      type: 'mask',
      mask: '000000-00',
      label: t('create.articleLabel'),
      placeholder: '000000-00',
      rules: { required: t('create.articleRequired') },
    },
    {
      name: 'category',
      type: 'select',
      label: t('create.categoryLabel'),
      placeholder: isCategoriesLoading ? t('create.loadingOptions') : t('create.selectCategory'),
      options: categoriesOptions,
      loading: isCategoriesLoading,
      searchable: true,
      rules: { required: t('create.categoryRequired') },
    },
    {
      name: 'tag',
      type: 'select',
      label: t('create.tagLabel'),
      options: tagOptions,
      disabled: isSingleScope,
      rules: { required: t('create.tagRequired') },
    },
    {
      name: 'brandsIds',
      type: 'multiselect',
      label: t('create.brandsLabel'),
      placeholder: isBrandsLoading ? t('create.loadingOptions') : t('create.selectBrands'),
      options: brandOptions,
      loading: isBrandsLoading,
      rules: { required: t('create.brandsRequired') },
    },
    {
      name: 'limitPerOrder',
      type: 'number',
      label: t('create.limitLabel'),
      placeholder: t('create.limitPlaceholder'),
    },
    {
      name: 'packageType',
      type: 'select',
      label: t('create.packageTypeLabel'),
      placeholder: t('create.selectType'),
      options: packageTypeOptions,
      rules: { required: t('create.packageTypeRequired') },
    },
    {
      name: 'itemsPerPackage',
      type: 'number',
      label: t('create.itemsPerPackageLabel'),
      placeholder: t('create.itemsPerPackagePlaceholder'),
      rules: { required: t('create.itemsPerPackageRequired') },
    },
    {
      name: 'initialPackagesCount',
      type: 'number',
      label: t('create.initialPackagesLabel'),
      placeholder: t('create.initialPackagesPlaceholder'),
      rules: { required: t('create.initialPackagesRequired') },
    },
  ];

  const onSubmit = async (data, reset) => {
    const payload = {
      ...data,
      limitPerOrder:
        data.limitPerOrder === 0 ||
        data.limitPerOrder === '' ||
        data.limitPerOrder === null
          ? null
          : Number(data.limitPerOrder),
      initialPackagesCount: Number(data.initialPackagesCount) || 0,
      itemsPerPackage: Number(data.itemsPerPackage) || 0,
    };

    try {
      await addProduct(payload).unwrap();
      toast.success(t('create.added'));
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'create.addFailed'));
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
        paperWidth={{ base: '100%', sm: 500, md: 700 }}
        defaultValues={{
          name: '',
          category: '',
          article: '',
          tag: availableTags[0] || '',
          limitPerOrder: '',
          brandsIds: [],
          packageType: 'PALLET',
          itemsPerPackage: 0,
          initialPackagesCount: 0,
        }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateProductPage;
