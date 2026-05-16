import { Button, Paper, Stack, TextInput, Title } from '@mantine/core';
import { Controller, useForm } from 'react-hook-form'; // Импортируем Controller
import toast from 'react-hot-toast';
import { useCreateCategoryMutation } from '../../store/api/api';

const CreateCategoryForm = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async data => {
    try {
      await createCategory(data).unwrap();
      toast.success(`Category "${data.name}" created!`);
      reset();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create category');
    }
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'md', sm: 'xl' }}
      mx="auto"
      w={{ base: '100%', sm: 400 }}
    >
      <Title
        order={3}
        mb={30}
        ta="center"
      >
        Create New Category
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={25}>
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Category name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
            }}
            render={({ field }) => (
              <TextInput
                label="Category Name"
                placeholder="Enter category name"
                withAsterisk
                error={errors.name?.message}
                h={{ base: 42, sm: 36 }}
                fz={{ base: 'md', sm: 'sm' }}
                styles={{ label: { marginBottom: 8 } }}
                {...field}
              />
            )}
          />

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            h={{ base: 46, sm: 40 }}
            fz={{ base: 'md', sm: 'sm' }}
            mt={20}
          >
            Create Category
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateCategoryForm;
