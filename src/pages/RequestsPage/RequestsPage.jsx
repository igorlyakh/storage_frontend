import { useSelector } from 'react-redux';
import RequestsList from '../../components/RequestsList';
import {
  useGetAdminWarehouseRequestsQuery,
  useGetWarehouseRequestsQuery,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const RequestsPage = () => {
  const userRole = useSelector(userRoleSelector);

  const { data: adminRequests } = useGetAdminWarehouseRequestsQuery(undefined, {
    skip: userRole !== 'ADMIN',
  });

  const { data: warehouseRequests } = useGetWarehouseRequestsQuery(undefined, {
    skip: userRole !== 'WAREHOUSE',
  });

  const requests = userRole === 'ADMIN' ? adminRequests : warehouseRequests;

  return (
    <div>
      <h1>All orders:</h1>
      <RequestsList requests={requests || []} />
    </div>
  );
};

export default RequestsPage;
