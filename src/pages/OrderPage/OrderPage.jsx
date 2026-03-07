import { useRef } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import BackLink from '../../components/BackLink';
import OrderItemsTable from '../../components/OrderItemsTable';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { id } = useParams();
  const { data } = useGetOrderByIdQuery(id);
  const location = useLocation();
  const backLinkPath = useRef(location.state?.from ?? '/');
  return (
    <>
      <BackLink redirectTo={backLinkPath.current} />
      <OrderItemsTable data={data?.items} />
    </>
  );
};

export default OrderPage;
