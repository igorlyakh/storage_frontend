import {
  Button,
  NumberInput,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useAddProductMutation } from '../../store/api/api';
import { productCategories } from './config';

const AddProductForm = () => {
  const [addProduct, { isLoading }] = useAddProductMutation();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
      category: productCategories[0] || '',
      limitPerOrder: '',
      initialQuantity: 1,
    },
  });

  const onSubmit = async data => {
    const payload = {
      ...data,
      limitPerOrder:
        !data.limitPerOrder || data.limitPerOrder === 0
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
      p="xl"
      mx="auto"
      w={{ base: '100%', sm: 450 }}
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
          <TextInput
            label="Product name"
            placeholder="Enter product name"
            withAsterisk
            {...register('name', { required: 'Product name is required!' })}
            error={errors.name?.message}
          />

          <Controller
            name="category"
            control={control}
            rules={{ required: 'Category is required!' }}
            render={({ field }) => (
              <Select
                {...field}
                label="Category"
                withAsterisk
                data={productCategories}
                error={errors.category?.message}
              />
            )}
          />

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
