import dayjs from 'dayjs';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const OrdersList = ({ data }) => {
  return (
    <ul className={styles.list}>
      {data?.map(order => (
        <li key={order.id}>
          <div>
            <span>Status:</span> <span>{order.status}</span>
          </div>
          <div>
            <span>Form store:</span> <span>{order.store.name}</span>
          </div>
          <span>items:</span>
          <ul>
            {order.items.map(item => (
              <li key={item.id}>
                <div>
                  <span>Product name: </span> <span>{item.product.name}</span>
                </div>
                <div>
                  <span>Qty: </span> <span>{item.requestedQty}</span>
                </div>
                <div>
                  <span>Category:</span> <span>{item.product.category}</span>
                </div>
              </li>
            ))}
          </ul>
          <div>
            <span>Sended:</span>{' '}
            <span>{dayjs(order.createdAt).format('DD.MM.YYYY HH:mm:ss ')}</span>
          </div>
          <div>
            <span>Changed:</span>{' '}
            <span>{dayjs(order.updatedAt).format('DD.MM.YYYY HH:mm:ss')}</span>
          </div>
          <Link>
            To order <ArrowRight />
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default OrdersList;
