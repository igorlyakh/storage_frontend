import { Center, Loader, Stack, Text, Title } from '@mantine/core';
import { useSelector } from 'react-redux';
import RequestsList from '../../components/RequestsList';
import {
  useGetAdminWarehouseRequestsQuery,
  useGetWarehouseRequestsQuery,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const RequestsPage = () => {
  const userRole = useSelector(userRoleSelector);

  const {
    data: adminRequests,
    isLoading: isAdminLoading,
    isError: isAdminError,
  } = useGetAdminWarehouseRequestsQuery(undefined, {
    skip: userRole !== 'ADMIN',
  });

  const {
    data: warehouseRequests,
    isLoading: isWarehouseLoading,
    isError: isWarehouseError,
  } = useGetWarehouseRequestsQuery(undefined, {
    skip: userRole !== 'WAREHOUSE',
  });

  const requests = userRole === 'ADMIN' ? adminRequests : warehouseRequests;
  const isLoading = userRole === 'ADMIN' ? isAdminLoading : isWarehouseLoading;
  const isError = userRole === 'ADMIN' ? isAdminError : isWarehouseError;

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader color="blue" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Text
        c="red"
        textAlign="center"
        mt="xl"
      >
        Failed to load orders!
      </Text>
    );
  }

  return (
    <Stack
      gap="md"
      p="md"
    >
      <Title order={2}>All orders</Title>

      <RequestsList requests={requests || []} />
    </Stack>
  );
};

export default RequestsPage;
