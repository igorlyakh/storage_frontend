import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useUpdateWarehouseRequestStatusMutation } from '../../store/api/api';
import styles from './styles.module.scss';

const RequestItem = ({ request }) => {
  const [updateStatus, { isLoading }] = useUpdateWarehouseRequestStatusMutation();

  const handleTakeInProgress = async () => {
    try {
      await updateStatus({ id: request.id, status: 'APPROVED' }).unwrap();
      toast.success('Заказ взят в обработку!');
    } catch (error) {
      toast.error('Ошибка при обновлении статуса');
      console.error(error);
    }
  };

  // Форматируем дату по твоему требованию
  const formattedDate = dayjs(request.createdAt).format('DD.MM.YYYY HH:mm:ss');

  // Определяем, нужно ли показывать кнопку.
  // Если статус 'NEW', кнопка есть. Если любой другой - скрываем.
  const showProcessButton = request.status === 'NEW';

  return (
    <div className={styles.requestItem}>
      <div className={styles.header}>
        {/* Tag заказа (AdminScope) */}
        <span className={styles.tag}>{request.category}</span>

        {/* Текущий статус для наглядности */}
        <span className={`${styles.statusBadge} ${styles[request.status.toLowerCase()]}`}>
          {request.status}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.date}>
          Создан: <strong>{formattedDate}</strong>
        </p>
        <p className={styles.info}>Товаров в заказе: {request.items?.length || 0} шт.</p>
      </div>

      <div className={styles.actions}>
        {/* Ссылка на подробную таблицу заказа */}
        <Link
          to={`/requests/${request.id}`}
          className={styles.detailsLink}
        >
          Подробнее
        </Link>

        {/* Кнопка смены статуса (скрывается, если статус изменился) */}
        {showProcessButton && (
          <button
            className={styles.processButton}
            onClick={handleTakeInProgress}
            disabled={isLoading}
          >
            {isLoading ? 'Обновление...' : 'Взять в работу'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestItem;
