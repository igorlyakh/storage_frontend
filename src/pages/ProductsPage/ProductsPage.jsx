import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import ProductsTable from '../../components/ProductsTable/ProductsTable';
import { useGetAllProductsQuery } from '../../store/api/api';

const ProductsPage = () => {
  const { t } = useTranslation('products');
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
        <Title order={2}>{t('management')}</Title>
        <ProductsTable data={data} />
      </Stack>
    </Container>
  );
};

export default ProductsPage;
