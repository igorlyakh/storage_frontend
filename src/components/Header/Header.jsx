import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const Header = () => {
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
            <Link
              className={styles.link}
              to="/login"
            >
              Login
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
