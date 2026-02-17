import OrderItem from '../OrderItem/OrderItem';
import styles from './styles.module.scss';

const OrdersList = ({ data }) => {
  return (
    <ul className={styles.list}>
      {data?.map(order => (
        <OrderItem
          key={order.id}
          store={order.store.name}
          status={order.status}
          sended={order.createdAt}
          updated={order.updatedAt}
        />
      ))}
    </ul>
  );
};

export default OrdersList;
