import styles from './styles.module.scss';

const OrderItemsItem = ({ requestedQty, name, shippedQty }) => {
  return (
    <li className={styles.orderItem}>
      <div className={styles.orderItem__header}>
        <span className={styles.orderItem__name}>{name}</span>
      </div>
      <div className={styles.orderItem__details}>
        <div className={styles.orderItem__stat}>
          <label>Requested Quantity</label>
          <span>{requestedQty}</span>
        </div>
        <div className={styles.orderItem__stat}>
          <label>Shipped Quantity</label>
          <span className={shippedQty === requestedQty ? styles.full : styles.partial}>
            {shippedQty}
          </span>
        </div>
      </div>
    </li>
  );
};

export default OrderItemsItem;
