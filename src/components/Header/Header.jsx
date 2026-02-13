import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <Link
        className={styles.logo}
        to="/"
      >
        Stock Control
      </Link>
    </header>
  );
};

export default Header;
