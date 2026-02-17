import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { tokenSelector, userRoleSelector } from '../store/selectors/selectors';

const ProtectedRoutes = ({ children, redirectTo = '/', approvedRoles }) => {
  const userRole = useSelector(userRoleSelector);
  const token = useSelector(tokenSelector);

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace={true}
      />
    );
  }

  if (approvedRoles.some(userRole)) {
    return children;
  }

  return (
    <Navigate
      to={redirectTo}
      replace={true}
    />
  );
};

export default ProtectedRoutes;
