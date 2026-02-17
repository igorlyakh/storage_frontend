import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api/api';
import { tokenSelector, userRole } from '../../store/selectors/selectors';
import { logoutAction } from '../../store/userSlice/userSlice';
import Button from '../Button';
import styles from './styles.module.scss';

const Header = () => {
  const token = useSelector(tokenSelector);
  const role = useSelector(userRole);
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
