import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';
import { logoutAction } from '../../store/userSlice/userSlice';
import Button from '../Button';
import DropdownMenu from '../DropDownMenu';
import styles from './styles.module.scss';

const Header = () => {
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const handler = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('You have successfully logged out!');
    } catch {
      toast.error('Something went wrong! Try again.');
    }
  };
  return (
    <header className={styles.header}>
      <Link
        className={styles.link}
        to="/"
      >
        Stock Control
      </Link>
      <nav className={styles.nav}>
        <ul className={styles.menu}>
          <li>
            <Link
              className={styles.link}
              to="/"
            >
              Home
            </Link>
          </li>
          {['ADMIN', 'WAREHOUSE'].includes(role) && (
            <li>
              <Link
                className={styles.link}
                to="/all-orders"
              >
                All orders
              </Link>
            </li>
          )}
          {role === 'STORE' && (
            <li>
              <Link
                className={styles.link}
                to="/orders"
              >
                Orders
              </Link>
            </li>
          )}
          {role === 'ADMIN' && (
            <li>
              <DropdownMenu
                title="Products"
                items={[
                  { label: 'All Products', to: '/products' },
                  { label: 'Create Product', to: '/products/create' },
                ]}
              />
            </li>
          )}
          <li>
            {token ? (
              <Button
                text={'Logout'}
                onClick={handler}
              />
            ) : (
              <Link
                className={styles.link}
                to="/login"
              >
                Login
              </Link>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
