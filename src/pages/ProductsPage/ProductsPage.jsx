import ProductsTable from '../../components/ProductsTable/ProductsTable';
import { useGetAllProductsQuery } from '../../store/api/api';

const ProductsPage = () => {
  const { data } = useGetAllProductsQuery();
  return <ProductsTable data={data} />;
};

export default ProductsPage;
