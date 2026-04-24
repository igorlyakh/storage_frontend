import { Container } from '@mantine/core';
import AddProductForm from '../../components/AddProductFrom';

const CreateProductPage = () => {
  return (
    <Container
      size="sm"
      py="xl"
    >
      <AddProductForm />
    </Container>
  );
};

export default CreateProductPage;
