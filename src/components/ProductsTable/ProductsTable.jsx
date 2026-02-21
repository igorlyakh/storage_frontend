import { useGetAllProductsQuery } from '../../store/api/api';
const ProductsTable = () => {
  const { data, isLoading } = useGetAllProductsQuery();
  if (isLoading) {
    return null;
  }
  return <div>{data[1]?.name}</div>;
};

export default ProductsTable;
