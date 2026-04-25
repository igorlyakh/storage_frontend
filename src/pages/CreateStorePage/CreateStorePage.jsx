import { Container } from '@mantine/core';
import CreateStoreForm from '../../components/CreateStoreForm/CreateStoreFrom';

const CreateStorePage = () => {
  return (
    <Container
      size="sm"
      py="xl"
    >
      <CreateStoreForm />
    </Container>
  );
};

export default CreateStorePage;
