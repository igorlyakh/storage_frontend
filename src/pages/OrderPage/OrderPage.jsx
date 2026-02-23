import { useParams } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import OrderItemsTable from '../../components/OrderItemsTable';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { id } = useParams();
  const { data } = useGetOrderByIdQuery(id);
  return (
    <>
      <BackLink />
      <OrderItemsTable data={data?.items} />
    </>
  );
};

export default OrderPage;
