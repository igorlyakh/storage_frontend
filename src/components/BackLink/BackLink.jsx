import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import styles from './styles.module.scss';

const BackLink = () => {
  return (
    <Link
      to=".."
      relative="path"
      className={styles.backLink}
    >
      <ArrowLeft
        size={20}
        className={styles.icon}
      />
      <span className={styles.text}>Go Back</span>
    </Link>
  );
};

export default BackLink;
