import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetMyOrdersQuery } from '../../store/api/api';

const MyOrdersPage = () => {
  const { data } = useGetMyOrdersQuery();
  return <OrdersList data={data?.data} />;
};

export default MyOrdersPage;
