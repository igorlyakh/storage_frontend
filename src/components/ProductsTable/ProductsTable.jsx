import { useGetAllProductsQuery } from '../../store/api/api';

const ProductsTable = () => {
  const { data } = useGetAllProductsQuery();
  return <div>{data[1]?.name}</div>;
};

export default ProductsTable;
