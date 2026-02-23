import OrderItemsItem from '../OrderItemsItem/OrderItemsItem';
import styles from './styles.module.scss';

const OrderItemsList = ({ data }) => {
  return (
    <ul className={styles.list}>
      {data?.map(item => (
        <OrderItemsItem
          key={item.id}
          name={item.product.name}
          requestedQty={item.requestedQty}
          shippedQty={item.shippedQty}
        />
      ))}
    </ul>
  );
};

export default OrderItemsList;
