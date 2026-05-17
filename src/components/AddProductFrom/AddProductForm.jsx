import {
  Button,
  InputBase,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { IMaskInput } from 'react-imask';
import {
  useAddProductMutation,
  useGetAllBrandsQuery,
  useGetAllCategoriesQuery,
} from '../../store/api/api';
import { productTags } from './config';

const AddProductForm = () => {
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const { data: productCategories = [], isLoading: isCategoriesLoading } =
    useGetAllCategoriesQuery();
  const [addProduct, { isLoading }] = useAddProductMutation();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      category: '',
      article: '',
      tag: productTags[0] || '',
      limitPerOrder: '',
      initialQuantity: 1,
      brandsIds: [],
    },
  });

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const categoriesOptions = productCategories.map(category => ({
    value: String(category.id),
    label: category.name,
  }));

  const onSubmit = async data => {
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
      reset();
      toast.success('Product added!');
    } catch (error) {
      toast.error(error.data?.message?.[0] || error.message || 'Failed to add product');
    }
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'md', sm: 'xl' }}
      mx="auto"
      w={{ base: '100%', sm: 500, md: 600 }}
    >
      <Title
        order={3}
        mb="lg"
        ta="center"
      >
        Add New Product
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="name"
            control={control}
            rules={{ required: 'Name is required!' }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Product name"
                placeholder="Enter product name"
                withAsterisk
                error={errors.name?.message}
              />
            )}
          />

          <Controller
            name="article"
            control={control}
            rules={{ required: 'article is required!' }}
            render={({ field }) => (
              <InputBase
                {...field}
                component={IMaskInput}
                mask="000000-00"
                label="Article"
                placeholder="000000-00"
                withAsterisk
                error={errors.article?.message}
              />
            )}
          />

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="md"
          >
            <Controller
              name="category"
              control={control}
              rules={{ required: 'Category is required!' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Category"
                  withAsterisk
                  placeholder={
                    isCategoriesLoading ? 'Loading categories...' : 'Select category'
                  }
                  data={categoriesOptions}
                  searchable
                  disabled={isCategoriesLoading}
                  rightSection={isCategoriesLoading ? <Loader size="xs" /> : null}
                  error={errors.category?.message}
                />
              )}
            />

            <Controller
              name="tag"
              control={control}
              rules={{ required: 'Tag is required!' }}
              render={({ field }) => (
                <Select
                  {...field}
                  label="Admin Tag"
                  withAsterisk
                  data={productTags}
                  error={errors.tag?.message}
                />
              )}
            />
          </SimpleGrid>

          <Controller
            name="brandsIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label="Brands"
                placeholder={isBrandsLoading ? 'Loading brands...' : 'Select brands'}
                data={brandOptions}
                searchable
                clearable
                disabled={isBrandsLoading}
                rightSection={isBrandsLoading ? <Loader size="xs" /> : null}
                error={errors.brandsIds?.message}
              />
            )}
          />

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="md"
          >
            <Controller
              name="limitPerOrder"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Limit (optional)"
                  placeholder="Enter limit"
                  min={0}
                  allowNegative={false}
                  hideControls
                />
              )}
            />

            <Controller
              name="initialQuantity"
              control={control}
              render={({ field }) => (
                <NumberInput
                  {...field}
                  label="Initial Quantity"
                  placeholder="Enter quantity"
                  min={0}
                  allowNegative={false}
                  withAsterisk
                  hideControls
                />
              )}
            />
          </SimpleGrid>

          <Button
            type="submit"
            mt="md"
            loading={isLoading}
            fullWidth
          >
            Create Product
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default AddProductForm;
