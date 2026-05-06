import {
  Button,
  Loader,
  MultiSelect,
  Paper,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateStoreMutation, useGetAllBrandsQuery } from '../../store/api/api';

const CreateStoreForm = () => {
  const { data: brands = [], isLoading: isBrandsLoading } = useGetAllBrandsQuery();
  const [createStore] = useCreateStoreMutation();

  const {
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      brandIds: [],
    },
  });

  const brandOptions = brands.map(brand => ({
    value: String(brand.id),
    label: brand.name,
  }));

  const onSubmit = async data => {
    try {
      await createStore(data).unwrap();
      reset();
      toast.success('Store created successfully!');
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to create store');
    }
  };

  const inputStyles = {
    label: { marginBottom: 8 },
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'md', sm: 'xl' }}
      mx="auto"
      w={{ base: '100%', sm: 450 }}
    >
      <Title
        order={3}
        mb={30}
        ta="center"
      >
        Create New Store
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={25}>
          {' '}
          <Controller
            name="name"
            control={control}
            rules={{
              required: 'Store name is required',
              minLength: { value: 3, message: 'Name must be at least 3 characters' },
            }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Store Name"
                placeholder="e.g. Store-1"
                withAsterisk
                error={errors.name?.message}
                h={{ base: 42, sm: 36 }}
                fz={{ base: 'md', sm: 'sm' }}
                styles={inputStyles}
                mb={15}
              />
            )}
          />
          <Controller
            name="brandIds"
            control={control}
            render={({ field }) => (
              <MultiSelect
                {...field}
                label="Assigned Brands"
                placeholder={isBrandsLoading ? 'Loading brands...' : 'Select brands'}
                data={brandOptions}
                searchable
                clearable
                nothingFoundMessage="No brands found"
                disabled={isBrandsLoading}
                rightSection={isBrandsLoading ? <Loader size="xs" /> : null}
                error={errors.brandIds?.message}
                value={field.value || []}
                onChange={field.onChange}
                fz={{ base: 'md', sm: 'sm' }}
                styles={inputStyles}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            loading={isSubmitting}
            mt={15}
            h={{ base: 46, sm: 40 }}
            fz={{ base: 'md', sm: 'sm' }}
          >
            Create Store
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateStoreForm;
