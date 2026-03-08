import UsersTable from '../../components/UsersTable/UsersTable';
import { useGetAllUsersQuery } from '../../store/api/api';

const AllUsersPage = () => {
  const { data } = useGetAllUsersQuery();

  return <UsersTable data={data} />;
};

export default AllUsersPage;
