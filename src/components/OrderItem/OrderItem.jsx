import dayjs from 'dayjs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const OrderItem = ({ store, status, sended, updated }) => {
  return (
    <div className={styles.item}>
      <p>
        <span>From: </span>
        <span>{store}</span>
      </p>
      <p>
        <span>Status: </span>
        <span>{status}</span>
      </p>
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
      <Link>
        To order <ArrowRight />
      </Link>
    </div>
  );
};

export default OrderItem;
