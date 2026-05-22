import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';

const ProtectedRoutes = ({ children, redirectTo = '/', allowedRoles }) => {
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

  if (!allowedRoles.includes(userRole)) {
    return (
      <Navigate
        to={redirectTo}
        replace={true}
      />
    );
  }

  return children;
};

export default ProtectedRoutes;
