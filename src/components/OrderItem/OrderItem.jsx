import clsx from 'clsx';
import dayjs from 'dayjs';
import { ArrowRight, Loader2, Play } from 'lucide-react'; // Добавил иконки
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useProcessOrderMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import styles from './styles.module.scss';

const OrderItem = ({ store, status, sended, updated, id }) => {
  const location = useLocation();
  const userRole = useSelector(userRoleSelector);

  const [processOrder, { isLoading }] = useProcessOrderMutation();

  const handleAccept = async () => {
    try {
      await processOrder({ orderId: id }).unwrap();
      toast.success('Order processed!');
    } catch (error) {
      toast.error(error.data?.message[0] || error.message);
    }
  };

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

      <div className={styles.footer}>
        {status === 'NEW' && ['ADMIN', 'WAREHOUSE'].includes(userRole) && (
          <button
            className={styles.acceptBtn}
            onClick={handleAccept}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2
                className={styles.spinner}
                size={16}
              />
            ) : (
              <>
                <span>Accept order</span>
                <Play
                  size={16}
                  fill="currentColor"
                />
              </>
            )}
          </button>
        )}

        <Link
          className={styles.link}
          to={`/orders/${id}`}
          state={{ from: location }}
        >
          <span>To order</span> <ArrowRight />
        </Link>
      </div>
    </li>
  );
};

export default OrderItem;
