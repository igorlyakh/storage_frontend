import { Center, SimpleGrid, Text } from '@mantine/core';
import RequestItem from '../RequestItem';

const RequestsList = ({ requests }) => {
  if (!requests || requests.length === 0) {
    return (
      <Center h={{ base: 100, sm: 200 }}>
        <Text
          c="dimmed"
          fz={{ base: 'md', sm: 'lg' }}
          fw={500}
        >
          List is empty!
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
      spacing={{ base: 'sm', sm: 'md', lg: 'lg' }}
    >
      {requests.map(request => (
        <RequestItem
          key={request.id}
          request={request}
        />
      ))}
    </SimpleGrid>
  );
};

export default RequestsList;
