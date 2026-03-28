import { useState } from 'react';
import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetMyOrdersQuery } from '../../store/api/api';
import styles from './styles.module.scss';

const MyOrdersPage = () => {
  const [page, setPage] = useState(1);

  const { data, isFetching } = useGetMyOrdersQuery(page, {
    pollingInterval: 10 * 60 * 1000,
    skipPollingIfUnfocused: true,
    refetchOnFocus: true,
  });

  const orders = data?.data || [];
  const meta = data?.meta;

  const showPagination = meta && meta.lastPage > 1;

  const handleNext = () => setPage(prev => prev + 1);
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <div className={styles.container}>
      <div className={isFetching ? styles.loadingOverlay : ''}>
        <OrdersList data={orders} />
      </div>

      {showPagination && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={handlePrev}
            disabled={page === 1 || isFetching}
          >
            Back
          </button>

          <span className={styles.pageInfo}>
            Page {page}/{meta.lastPage}
          </span>

          <button
            className={styles.pageBtn}
            onClick={handleNext}
            disabled={page === meta.lastPage || isFetching}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
