import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import ProductsTable from '../../components/ProductsTable/ProductsTable';
import { useGetAllProductsQuery } from '../../store/api/api';

const ProductsPage = () => {
  const { data, isLoading } = useGetAllProductsQuery();

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
        <Title order={2}>Products Management</Title>
        <ProductsTable data={data} />
      </Stack>
    </Container>
  );
};

export default ProductsPage;
