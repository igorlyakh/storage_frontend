import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import LowStockModal from '../../components/ui/LowStockModal';
import { useLazyGetLowStockProductsQuery } from '../../store/api/api';
import {
  lowStockCheckTokenSelector,
  tokenSelector,
  userRoleSelector,
} from '../../store/selectors/selectors';

const NOON_HOUR = 12;
const STORAGE_KEY = 'lowStockLastCheckDate';
const POLL_INTERVAL = 5 * 60 * 1000;

const LowStockNotifier = () => {
  const { t } = useTranslation('warehouse');
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const checkToken = useSelector(lowStockCheckTokenSelector);

  const [fetchLowStockProducts] = useLazyGetLowStockProductsQuery();
  const [lowStockProducts, setLowStockProducts] = useState(null);

  const prevCheckToken = useRef(checkToken);

  const runCheck = useCallback(
    silent => {
      fetchLowStockProducts(20)
        .unwrap()
        .then(products => {
          if (products?.length > 0) {
            setLowStockProducts(products);
          } else if (!silent) {
            toast.success(t('lowStock.none'));
          }
        })
        .catch(() => {
          // non-critical, ignore
        });
    },
    [fetchLowStockProducts, t],
  );

  useEffect(() => {
    if (!token || role !== 'ADMIN') return undefined;

    const maybeRunDailyCheck = () => {
      const now = new Date();
      const todayKey = now.toISOString().split('T')[0];
      const lastCheck = localStorage.getItem(STORAGE_KEY);

      if (now.getHours() >= NOON_HOUR && lastCheck !== todayKey) {
        localStorage.setItem(STORAGE_KEY, todayKey);
        runCheck(true);
      }
    };

    maybeRunDailyCheck();
    const interval = setInterval(maybeRunDailyCheck, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [token, role, runCheck]);

  useEffect(() => {
    if (checkToken !== prevCheckToken.current) {
      prevCheckToken.current = checkToken;
      if (role === 'ADMIN') {
        runCheck(false);
      }
    }
  }, [checkToken, role, runCheck]);

  return (
    <LowStockModal
      key={lowStockProducts ? 'shown' : 'hidden'}
      opened={!!lowStockProducts}
      onClose={() => setLowStockProducts(null)}
      products={lowStockProducts || []}
    />
  );
};

export default LowStockNotifier;
