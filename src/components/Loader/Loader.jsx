import { ColorRing } from 'react-loader-spinner';

const Loader = () => {
  return (
    <ColorRing
      visible={true}
      height="100"
      width="100"
      ariaLabel="color-ring-loading"
      wrapperStyle={{ position: 'absolute', top: '50%', left: '50%' }}
      wrapperClass="color-ring-wrapper"
      colors={['#849b87', '#849b87', '#849b87', '#849b87', '#849b87']}
    />
  );
};

export default Loader;
