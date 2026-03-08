import { Link } from 'react-router-dom';
import Navigation from '../Navigation/Navigation';
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
      <Navigation />
    </header>
  );
};

export default Header;
