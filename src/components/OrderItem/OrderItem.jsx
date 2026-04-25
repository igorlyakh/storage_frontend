import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { ArrowRight, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useProcessOrderMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const getStatusColor = status => {
  switch (status) {
    case 'NEW':
      return 'blue';
    case 'IN_PROGRESS':
      return 'yellow';
    case 'SENT':
      return 'orange';
    case 'COMPLETED':
      return 'green';
    default:
      return 'gray';
  }
};

const OrderItem = ({ store, status, sended, updated, id }) => {
  const location = useLocation();
  const userRole = useSelector(userRoleSelector);
  const [processOrder, { isLoading }] = useProcessOrderMutation();

  const handleAccept = async () => {
    try {
      await processOrder({ orderId: id }).unwrap();
      toast.success('Order processed!');
    } catch (error) {
      toast.error(error.data?.message?.[0] || error.message || 'Error processing order');
    }
  };

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      padding="md"
      display="flex"
      style={{ flexDirection: 'column' }}
    >
      <Group
        justify="space-between"
        mb="sm"
      >
        <Text
          fw={600}
          size="lg"
        >
          <Text
            span
            c="dimmed"
            size="sm"
            fw={400}
          >
            From:{' '}
          </Text>
          {store}
        </Text>
        <Badge color={getStatusColor(status)}>{status}</Badge>
      </Group>

      <Stack
        gap="xs"
        mb="lg"
        style={{ flexGrow: 1 }}
      >
        <Text size="sm">
          <Text
            span
            c="dimmed"
          >
            Sended:{' '}
          </Text>
          <Text
            span
            fw={500}
          >
            {dayjs(sended).format('DD.MM.YYYY HH:mm:ss')}
          </Text>
        </Text>
        {updated !== sended && (
          <Text size="sm">
            <Text
              span
              c="dimmed"
            >
              Updated:{' '}
            </Text>
            <Text
              span
              fw={500}
            >
              {dayjs(updated).format('DD.MM.YYYY HH:mm:ss')}
            </Text>
          </Text>
        )}
      </Stack>

      <Group
        justify="space-between"
        mt="auto"
      >
        {status === 'NEW' && ['ADMIN', 'WAREHOUSE'].includes(userRole) && (
          <Button
            size="sm"
            color="blue"
            onClick={handleAccept}
            loading={isLoading}
            leftSection={
              <Play
                size={16}
                fill="currentColor"
              />
            }
          >
            Accept order
          </Button>
        )}

        <Button
          component={Link}
          to={`/orders/${id}`}
          state={{ from: location }}
          variant="subtle"
          size="sm"
          rightSection={<ArrowRight size={16} />}
          style={{ marginLeft: 'auto' }}
        >
          To order
        </Button>
      </Group>
    </Card>
  );
};

export default OrderItem;
