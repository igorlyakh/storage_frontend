import { Container } from '@mantine/core';
import CreateUserForm from '../../components/CreateUserForm/CreateUserForm';

const CreateUserPage = () => {
  return (
    <Container
      size="sm"
      py="xl"
    >
      <CreateUserForm />
    </Container>
  );
};

export default CreateUserPage;
