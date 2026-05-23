import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateStoreMutation, useGetAllBrandsQuery } from '../../store/api/api';

const CreateStorePage = () => {
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
      label: 'Store Name',
      placeholder: 'e.g. Store-1',
      rules: {
        required: 'Store name is required',
        minLength: { value: 3, message: 'Name must be at least 3 characters' },
      },
    },
    {
      name: 'brandIds',
      type: 'multiselect',
      label: 'Assigned Brands',
      placeholder: isBrandsLoading ? 'Loading brands...' : 'Select brands',
      options: brandOptions,
      loading: isBrandsLoading,
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      await createStore(data).unwrap();
      toast.success('Store created successfully!');
      reset();
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to create store');
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title="Create New Store"
        submitLabel="Create Store"
        paperWidth={{ base: '100%', sm: 450 }}
        fields={fields}
        defaultValues={{ name: '', brandIds: [] }}
        onSubmit={onSubmit}
        isLoading={isSubmitting}
      />
    </Container>
  );
};

export default CreateStorePage;
