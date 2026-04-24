import { Center, Container, Loader, Stack, Title } from '@mantine/core';
import UsersTable from '../../components/UsersTable/UsersTable';
import { useGetAllUsersQuery } from '../../store/api/api';

const AllUsersPage = () => {
  const { data, isLoading } = useGetAllUsersQuery();

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader size="xl" />
      </Center>
    );
  }

  return (
    <Container
      size="xl"
      py="md"
    >
      <Stack>
        <Title order={2}>User Management</Title>
        <UsersTable data={data} />
      </Stack>
    </Container>
  );
};

export default AllUsersPage;
