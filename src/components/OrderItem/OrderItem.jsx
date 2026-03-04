import clsx from 'clsx';
import dayjs from 'dayjs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const OrderItem = ({ store, status, sended, updated, id }) => {
  return (
    <li className={styles.item}>
      <div className={styles.wrapper}>
        <p className={styles.from}>
          <span>From:</span>
          <span>{store}</span>
        </p>
        <p>
          <span>Status: </span>
          <span
            className={clsx(styles.status, {
              [styles.completed]: status === 'COMPLETED',
              [styles.new]: status === 'NEW',
              [styles.inProgress]: status === 'IN_PROGRESS',
            })}
          >
            {status}
          </span>
        </p>
      </div>
      <p>
        <span>Sended: </span>
        <span>{dayjs(sended).format('DD.MM.YYYY HH:mm:ss')}</span>
      </p>
      {updated !== sended && (
        <p>
          <span>Updated: </span>
          <span>{dayjs(updated).format('DD.MM.YYYY HH:mm:ss')}</span>
        </p>
      )}
      <Link
        className={styles.link}
        to={`/orders/${id}`}
      >
        <span>To order</span> <ArrowRight />
      </Link>
    </li>
  );
};

export default OrderItem;
