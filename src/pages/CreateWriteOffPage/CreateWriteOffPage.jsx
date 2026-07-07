import { Container, Title } from '@mantine/core';
import CreateOrderTable from '../../components/CreateOrderTable/CreateOrderTable';

const CreateWriteOffPage = () => {
  return (
    <Container
      size="xl"
      py="xl"
    >
      <Title order={2}>Warehouse Write-off</Title>
      <CreateOrderTable writeOff />
    </Container>
  );
};

export default CreateWriteOffPage;
