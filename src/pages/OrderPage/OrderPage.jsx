import { useParams } from 'react-router-dom';
import OrderItemsList from '../../components/OrderItemsList';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { id } = useParams();
  const { data } = useGetOrderByIdQuery(id);
  return <OrderItemsList data={data?.items} />;
};

export default OrderPage;
