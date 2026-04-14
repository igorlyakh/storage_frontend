import RequestsList from '../../components/RequestsList';
import { useGetAdminWarehouseRequestsQuery } from '../../store/api/api';

const AdminRequestsPage = () => {
  const { data: requests } = useGetAdminWarehouseRequestsQuery();

  return (
    <div>
      <h1>All orders:</h1>
      <RequestsList requests={requests} />
    </div>
  );
};

export default AdminRequestsPage;
