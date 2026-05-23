import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateBrandMutation } from '../../store/api/api';

const CreateBrandPage = () => {
  const [createBrand, { isLoading }] = useCreateBrandMutation();

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Brand Name',
      placeholder: 'Enter brand name',
      rules: {
        required: 'Brand name is required',
        minLength: { value: 2, message: 'Minimum 2 characters' },
      },
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      await createBrand(data.name).unwrap();
      toast.success(`Brand "${data.name}" created!`);
      reset();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create brand');
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title="Create New Brand"
        submitLabel="Create Brand"
        fields={fields}
        defaultValues={{ name: '' }}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CreateBrandPage;
