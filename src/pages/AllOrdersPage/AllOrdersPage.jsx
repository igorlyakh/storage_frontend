import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetAllOrdersQuery } from '../../store/api/api';

const AllOrdersPage = () => {
  const { data } = useGetAllOrdersQuery(
    {},
    {
      pollingInterval: 10 * 60 * 1000,
      skipPollingIfUnfocused: true,
    },
  );
  return <OrdersList data={data} />;
};

export default AllOrdersPage;
