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
      toast.success('Approved!');
    } catch (error) {
      toast.error('Error!');
      console.error(error);
    }
  };

  const formattedDate = dayjs(request.createdAt).format('DD.MM.YYYY HH:mm:ss');

  const showProcessButton = request.status === 'NEW';

  return (
    <div className={styles.requestItem}>
      <div className={styles.header}>
        <span className={styles.tag}>{request.category}</span>

        <span className={`${styles.statusBadge} ${styles[request.status.toLowerCase()]}`}>
          {request.status}
        </span>
      </div>

      <div className={styles.body}>
        <p className={styles.date}>
          Создан: <strong>{formattedDate}</strong>
        </p>
        <p className={styles.info}>Products in order: {request.items?.length || 0}</p>
      </div>

      <div className={styles.actions}>
        <Link
          to={`/requests/${request.id}`}
          className={styles.detailsLink}
        >
          Details
        </Link>

        {showProcessButton && (
          <button
            className={styles.processButton}
            onClick={handleTakeInProgress}
            disabled={isLoading}
          >
            {isLoading ? 'Updating...' : 'Approve'}
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestItem;
