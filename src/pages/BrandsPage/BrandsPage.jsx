import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import BrandsTable from '../../components/BrandsTable';
import { useGetAllBrandsQuery } from '../../store/api/api';

const BrandsPage = () => {
  const { data, isLoading } = useGetAllBrandsQuery();

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
        <Title order={2}>Brands Management</Title>
        <BrandsTable data={data} />
      </Stack>
    </Container>
  );
};

export default BrandsPage;
