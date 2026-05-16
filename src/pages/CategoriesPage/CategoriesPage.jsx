import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import CategoriesTable from '../../components/CategoriesTable';
import { useGetAllCategoriesQuery } from '../../store/api/api';

const CategoriesPage = () => {
  const { data, isLoading } = useGetAllCategoriesQuery();

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
        <Title order={2}>Categories Management</Title>
        <CategoriesTable data={data} />
      </Stack>
    </Container>
  );
};

export default CategoriesPage;
