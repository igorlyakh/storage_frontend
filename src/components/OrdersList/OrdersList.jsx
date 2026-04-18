import { Center, SimpleGrid, Text } from '@mantine/core';
import OrderItem from '../OrderItem';

const OrdersList = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Center h={150}>
        <Text
          c="dimmed"
          size="lg"
          fw={500}
        >
          No orders found
        </Text>
      </Center>
    );
  }

  return (
    <SimpleGrid
      cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
      spacing="md"
    >
      {data.map(order => (
        <OrderItem
          key={order.id}
          store={order.store?.name}
          status={order.status}
          sended={order.createdAt}
          updated={order.updatedAt}
          id={order.id}
        />
      ))}
    </SimpleGrid>
  );
};

export default OrdersList;
