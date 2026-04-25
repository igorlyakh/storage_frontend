import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import StoresTable from '../../components/StoresTable/StoresTable';
import { useGetAllStoresQuery } from '../../store/api/api';

const StoresPage = () => {
  const { data, isLoading } = useGetAllStoresQuery();

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader
          size="xl"
          color="blue"
        />
      </Center>
    );
  }

  return (
    <Container
      size="xl"
      py="md"
    >
      <Stack gap="lg">
        <Title order={2}>Stores Management</Title>
        <StoresTable data={data} />
      </Stack>
    </Container>
  );
};

export default StoresPage;
