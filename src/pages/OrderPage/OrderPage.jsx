import { useParams } from 'react-router-dom';
import OrderItemsTable from '../../components/OrderItemsTable';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { id } = useParams();
  const { data } = useGetOrderByIdQuery(id);
  return <OrderItemsTable data={data?.items} />;
};

export default OrderPage;
