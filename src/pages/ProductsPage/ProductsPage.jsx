import ProductsTable from '../../components/ProductsTable/ProductsTable';
import { useGetAllProductsQuery } from '../../store/api/api';

const ProductsPage = () => {
  const { data, error, isError, isLoading } = useGetAllProductsQuery();
  console.log({ data, error, isError, isLoading });
  return <ProductsTable data={data} />;
};

export default ProductsPage;
