import { useState } from 'react';
import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetAllOrdersQuery } from '../../store/api/api';
import styles from './styles.module.scss';

const AllOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('NEW');
  const [storeId, setStoreId] = useState('');

  const { data, isFetching } = useGetAllOrdersQuery(
    {
      page,
      status,
      storeId: storeId || undefined,
    },
    {
      pollingInterval: 10 * 60 * 1000,
      skipPollingIfUnfocused: true,
      refetchOnFocus: true,
    },
  );

  const orders = data?.data || [];
  const meta = data?.meta;

  const showPagination = meta && meta.lastPage > 1;

  const handleStatusChange = e => {
    setStatus(e.target.value);
    setPage(1);
  };

  const handleStoreChange = e => {
    setStoreId(e.target.value);
    setPage(1);
  };

  const handleNext = () => setPage(prev => prev + 1);
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.filterItem}>
          <label>Status:</label>
          <select
            value={status}
            onChange={handleStatusChange}
          >
            <option value="NEW">New</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>

        <div className={styles.filterItem}>
          <label>Store ID:</label>
          <input
            type="text"
            value={storeId}
            onChange={handleStoreChange}
            placeholder="Enter Store ID..."
          />
        </div>
      </div>

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

export default AllOrdersPage;
