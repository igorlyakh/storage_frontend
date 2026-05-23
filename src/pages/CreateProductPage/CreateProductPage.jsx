import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../../components/ui/DynamicForm';
import { productTags } from '../../constants/productTags';
import {
  useAddProductMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
} from '../../store/api/api';

const CreateProductPage = () => {
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const { data: productCategories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const [addProduct, { isLoading: isSubmitting }] = useAddProductMutation();

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const categoriesOptions = productCategories.map(category => ({
    value: String(category.id),
    label: category.name,
  }));

  const tagOptions = productTags.map(tag => ({ value: tag, label: tag }));

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
      rules: { required: 'Tag is required!' },
    },
    {
      name: 'brandsIds',
      type: 'multiselect',
      label: 'Brands',
      placeholder: isBrandsLoading ? 'Loading...' : 'Select brands',
      options: brandOptions,
      loading: isBrandsLoading,
    },
    {
      name: 'limitPerOrder',
      type: 'number',
      label: 'Limit (optional)',
      placeholder: 'Enter limit',
    },
    {
      name: 'initialQuantity',
      type: 'number',
      label: 'Initial Quantity',
      placeholder: 'Enter quantity',
      rules: { required: 'Quantity is required' },
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
      initialQuantity: Number(data.initialQuantity) || 0,
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
        paperWidth={{ base: '100%', sm: 500, md: 600 }}
        defaultValues={{
          name: '',
          category: '',
          article: '',
          tag: productTags[0] || '',
          limitPerOrder: '',
          initialQuantity: 1,
          brandsIds: [],
        }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateProductPage;
