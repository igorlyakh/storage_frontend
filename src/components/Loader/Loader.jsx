import { ColorRing } from 'react-loader-spinner';
import styles from './styles.module.scss';

const Loader = () => {
  return (
    <div className={styles.wrapper}>
      <ColorRing
        visible={true}
        height="100"
        width="100"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#849b87', '#849b87', '#849b87', '#849b87', '#849b87']}
      />
    </div>
  );
};

export default Loader;
