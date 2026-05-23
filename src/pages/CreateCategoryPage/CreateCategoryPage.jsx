import { Container } from '@mantine/core';
import toast from 'react-hot-toast';
import DynamicForm from '../../components/ui/DynamicForm';
import { useCreateCategoryMutation } from '../../store/api/api';

const CreateCategoryPage = () => {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const fields = [
    {
      name: 'name',
      type: 'text',
      label: 'Category Name',
      placeholder: 'Enter category name',
      rules: {
        required: 'Category name is required',
        minLength: { value: 2, message: 'Minimum 2 characters' },
      },
    },
  ];

  const onSubmit = async (data, reset) => {
    try {
      await createCategory(data).unwrap();
      toast.success(`Category "${data.name}" created!`);
      reset();
    } catch (error) {
      toast.error(error.data?.message || 'Failed to create category');
    }
  };

  return (
    <Container
      size="sm"
      py="xl"
    >
      <DynamicForm
        title="Create New Category"
        submitLabel="Create Category"
        fields={fields}
        defaultValues={{ name: '' }}
        onSubmit={onSubmit}
        isLoading={isLoading}
      />
    </Container>
  );
};

export default CreateCategoryPage;
