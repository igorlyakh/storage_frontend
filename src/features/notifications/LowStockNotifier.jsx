import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LowStockModal from '../../components/ui/LowStockModal';
import { useLazyGetLowStockProductsQuery } from '../../store/api/api';
import { justLoggedInSelector, userRoleSelector } from '../../store/selectors/selectors';
import { clearJustLoggedIn } from '../../store/userSlice/userSlice';

const LowStockNotifier = () => {
  const dispatch = useDispatch();
  const role = useSelector(userRoleSelector);
  const justLoggedIn = useSelector(justLoggedInSelector);
  const [fetchLowStockProducts] = useLazyGetLowStockProductsQuery();

  const [lowStockProducts, setLowStockProducts] = useState(null);

  useEffect(() => {
    if (!justLoggedIn || role !== 'ADMIN') return;

    dispatch(clearJustLoggedIn());

    fetchLowStockProducts(20)
      .unwrap()
      .then(products => {
        if (products?.length > 0) {
          setLowStockProducts(products);
        }
      })
      .catch(() => {
        // non-critical, ignore
      });
  }, [justLoggedIn, role, dispatch, fetchLowStockProducts]);

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
