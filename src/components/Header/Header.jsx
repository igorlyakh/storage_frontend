import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { tokenSelector } from '../../store/selectors/selectors';
import Button from '../Button';
import styles from './styles.module.scss';

const Header = () => {
  const token = useSelector(tokenSelector);
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
          <li>
            {token ? (
              <Button text={'Logout'} />
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
