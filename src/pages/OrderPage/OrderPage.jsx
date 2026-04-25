import { Button, Center, Container, Loader, Stack, Title } from '@mantine/core';
import { ArrowLeft } from 'lucide-react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import OrderItemsTable from '../../components/OrderItemsTable/OrderItemsTable';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(id);
  const navigate = useNavigate();
  const location = useLocation();

  const backLinkPath = location.state?.from ?? '/';

  if (isLoading) {
    return (
      <Center h={300}>
        <Loader
          size="xl"
          color="blue"
        />
      </Center>
    );
  }

  return (
    <Container
      size="xl"
      py="md"
    >
      <Stack gap="lg">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate(backLinkPath)}
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        >
          Back to Orders
        </Button>
        <Title order={2}>Order Details</Title>
        {order && <OrderItemsTable order={order} />}
      </Stack>
    </Container>
  );
};

export default OrderPage;
