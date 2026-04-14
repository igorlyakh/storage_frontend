import RequestItem from './RequestItem';
import styles from './styles.module.scss';

const RequestsList = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return <div className={styles.emptyState}>Нет активных заявок</div>;
  }

  return (
    <div className={styles.listContainer}>
      {requests.map(request => (
        <RequestItem
          key={request.id}
          request={request}
        />
      ))}
    </div>
  );
};

export default RequestsList;
