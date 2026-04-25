import { Container } from '@mantine/core';
import CreateBrandForm from '../../components/CreateBrandForm/CreateBrandForm';

const CreateBrandPage = () => {
  return (
    <Container
      size="sm"
      py="xl"
    >
      <CreateBrandForm />
    </Container>
  );
};

export default CreateBrandPage;
