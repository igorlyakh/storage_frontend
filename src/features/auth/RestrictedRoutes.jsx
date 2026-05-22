import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { tokenSelector } from '../../store/selectors/selectors';

const RestrictedRouts = ({ children, redirectTo = '/' }) => {
  const userToken = useSelector(tokenSelector);

  if (userToken) {
    return (
      <Navigate
        to={redirectTo}
        replace={true}
      />
    );
  }

  return children;
};

export default RestrictedRouts;
