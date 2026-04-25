import { Button, Paper, Stack, TextInput, Title } from '@mantine/core';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateBrandMutation } from '../../store/api/api';

const CreateBrandForm = () => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: '',
    },
  });

  const onSubmit = async ({ name }) => {
    try {
      await createBrand(name).unwrap();
      toast.success(`Brand "${name}" created!`);
      reset();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create brand');
    }
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p="xl"
      mx="auto"
      w={{ base: '100%', sm: 400 }}
    >
      <Title
        order={3}
        mb="lg"
        ta="center"
      >
        Create New Brand
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Brand Name"
            placeholder="Enter brand name"
            withAsterisk
            {...register('name', {
              required: 'Brand name is required',
              minLength: { value: 2, message: 'Minimum 2 characters' },
            })}
            error={errors.name?.message}
          />

          <Button
            type="submit"
            mt="md"
            fullWidth
            loading={isLoading}
          >
            Create Brand
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateBrandForm;
