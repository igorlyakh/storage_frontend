import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import DynamicForm from '../../components/ui/DynamicForm';
import { productTags } from '../../constants/productTags';
import {
  useAddProductMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
} from '../../store/api/api';
import { adminScopesSelector } from '../../store/selectors/selectors';

const CreateProductPage = () => {
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
    { value: 'PALLET', label: 'Pallet' },
    { value: 'BOX', label: 'Box' },
    { value: 'PACKAGE', label: 'Package' },
  ];

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Product name',
      placeholder: 'Enter product name',
      rules: { required: 'Name is required!' },
    },
    {
      name: 'article',
      type: 'mask',
      mask: '000000-00',
      label: 'Article',
      placeholder: '000000-00',
      rules: { required: 'Article is required!' },
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      placeholder: isCategoriesLoading ? 'Loading...' : 'Select category',
      options: categoriesOptions,
      loading: isCategoriesLoading,
      searchable: true,
      rules: { required: 'Category is required!' },
    },
    {
      name: 'tag',
      type: 'select',
      label: 'Admin Tag',
      options: tagOptions,
      disabled: isSingleScope,
      rules: { required: 'Tag is required!' },
    },
    {
      name: 'brandsIds',
      type: 'multiselect',
      label: 'Brands',
      placeholder: isBrandsLoading ? 'Loading...' : 'Select brands',
      options: brandOptions,
      loading: isBrandsLoading,
      rules: { required: 'Brands are required!' },
    },
    {
      name: 'limitPerOrder',
      type: 'number',
      label: 'Limit (optional)',
      placeholder: 'Enter limit',
    },
    {
      name: 'packageType',
      type: 'select',
      label: 'Package Type',
      placeholder: 'Select type',
      options: packageTypeOptions,
      rules: { required: 'Package type is required!' },
    },
    {
      name: 'itemsPerPackage',
      type: 'number',
      label: 'Items per Package',
      placeholder: 'E.g., 24',
      rules: { required: 'Items per package is required!' },
    },
    {
      name: 'initialPackagesCount',
      type: 'number',
      label: 'Initial Packages Count',
      placeholder: 'E.g., 5',
      rules: { required: 'Packages count is required!' },
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
      toast.success('Product added!');
      reset();
    } catch (error) {
      toast.error(error.data?.message?.[0] || error.message || 'Failed to add product');
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title="Add New Product"
        submitLabel="Create Product"
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
