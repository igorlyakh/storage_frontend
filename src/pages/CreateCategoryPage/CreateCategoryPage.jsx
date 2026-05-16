import { Container } from '@mantine/core';
import CreateCategoryForm from '../../components/CreateCategoryForm/CreateCategoryForm';

const CreateCategoryPage = () => {
  return (
    <Container
      size="sm"
      py="xl"
    >
      <CreateCategoryForm />
    </Container>
  );
};

export default CreateCategoryPage;
