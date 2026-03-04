import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetAllOrdersQuery } from '../../store/api/api';

const AllOrdersPage = () => {
  const { data } = useGetAllOrdersQuery();
  return <OrdersList data={data} />;
};

export default AllOrdersPage;
