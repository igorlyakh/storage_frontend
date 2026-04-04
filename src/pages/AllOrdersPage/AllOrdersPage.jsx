import { useState } from 'react';
import OrdersList from '../../components/OrdersList/OrdersList';
import { useGetAllOrdersQuery, useGetAllStoresQuery } from '../../store/api/api';
import styles from './styles.module.scss';

const AllOrdersPage = () => {
  const [page, setPage] = useState(1);
  const [statuses, setStatuses] = useState(['NEW', 'IN_PROGRESS']);
  const [storeIds, setStoreIds] = useState([]);
  const [date, setDate] = useState('');

  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  const { data: storesData } = useGetAllStoresQuery();
  const stores = storesData || [];

  const { data, isFetching } = useGetAllOrdersQuery(
    {
      page,
      statuses: statuses.length ? statuses.join(',') : undefined,
      storeIds: storeIds.length ? storeIds.join(',') : undefined,
      date: date || undefined,
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

  const toggleStatus = value => {
    setStatuses(prev => {
      const newStatuses = prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value];
      return newStatuses;
    });
    setPage(1);
  };

  const toggleStore = value => {
    setStoreIds(prev => {
      const newStores = prev.includes(value)
        ? prev.filter(s => s !== value)
        : [...prev, value];
      return newStores;
    });
    setPage(1);
  };

  const handleDateChange = e => {
    setDate(e.target.value);
    setPage(1);
  };

  const handleNext = () => setPage(prev => prev + 1);
  const handlePrev = () => setPage(prev => Math.max(prev - 1, 1));

  return (
    <div className={styles.container}>
      <div
        className={styles.filters}
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: '20px',
          alignItems: 'flex-start',
        }}
      >
        <div
          className={styles.filterItem}
          style={{ position: 'relative' }}
        >
          <label style={{ display: 'block', marginBottom: '5px' }}>Statuses:</label>
          <button
            onClick={() => setIsStatusOpen(!isStatusOpen)}
            style={{
              width: '200px',
              padding: '8px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {statuses.length > 0 ? `Selected (${statuses.length})` : 'All Statuses'}
          </button>

          {isStatusOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {['NEW', 'IN_PROGRESS', 'COMPLETED'].map(status => (
                <label
                  key={status}
                  style={{
                    display: 'block',
                    padding: '8px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={statuses.includes(status)}
                    onChange={() => toggleStatus(status)}
                    style={{ marginRight: '8px' }}
                  />
                  {status}
                </label>
              ))}
            </div>
          )}
        </div>

        <div
          className={styles.filterItem}
          style={{ position: 'relative' }}
        >
          <label style={{ display: 'block', marginBottom: '5px' }}>Stores:</label>
          <button
            onClick={() => setIsStoreOpen(!isStoreOpen)}
            style={{
              width: '200px',
              padding: '8px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            {storeIds.length > 0 ? `Selected (${storeIds.length})` : 'All Stores'}
          </button>

          {isStoreOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                zIndex: 10,
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            >
              {stores.map(store => (
                <label
                  key={store.id}
                  style={{
                    display: 'block',
                    padding: '8px',
                    cursor: 'pointer',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={storeIds.includes(store.id)}
                    onChange={() => toggleStore(store.id)}
                    style={{ marginRight: '8px' }}
                  />
                  {store.name || store.id}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className={styles.filterItem}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Date:</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="date"
              value={date}
              onChange={handleDateChange}
              style={{ padding: '8px' }}
            />
            {date && (
              <button
                onClick={() => {
                  setDate('');
                  setPage(1);
                }}
                style={{ padding: '8px', cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>
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
