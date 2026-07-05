import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import { ArrowRight, CheckCheck, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { useCompleteOrderMutation, useProcessOrderMutation } from '../../store/api/api';
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

  const [processOrder, { isLoading: isProcessing }] = useProcessOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] = useCompleteOrderMutation();

  const handleProcess = async () => {
    try {
      await processOrder({ orderId: id }).unwrap();
      toast.success('Order processed!');
    } catch (error) {
      toast.error(error.data?.message?.[0] || error.message || 'Error processing order');
    }
  };

  const handleComplete = async () => {
    try {
      await completeOrder(id).unwrap();
      toast.success('Order successfully completed!');
    } catch (error) {
      toast.error(error.data?.message?.[0] || error.message || 'Error completing order');
    }
  };

  const hasActionBtn =
    (status === 'NEW' && ['ADMIN', 'WAREHOUSE'].includes(userRole)) || status === 'SENT';

  return (
    <Card
      withBorder
      shadow="sm"
      radius="md"
      padding={{ base: 'sm', sm: 'md' }}
      display="flex"
      style={{ flexDirection: 'column' }}
    >
      <Group
        justify="space-between"
        mb={{ base: 'xs', sm: 'sm' }}
        align="flex-start"
      >
        <Text
          fw={600}
          fz={{ base: 'md', sm: 'lg' }}
        >
          <Text
            span
            c="dimmed"
            fz={{ base: 'xs', sm: 'sm' }}
            fw={400}
          >
            From:{' '}
          </Text>
          {store}
        </Text>
        <Badge
          color={getStatusColor(status)}
          size="sm"
        >
          {status.replace('_', ' ')}
        </Badge>
      </Group>

      <Stack
        gap={{ base: 4, sm: 'xs' }}
        mb={{ base: 'md', sm: 'lg' }}
        style={{ flexGrow: 1 }}
      >
        <Text fz={{ base: 'xs', sm: 'sm' }}>
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
            {dayjs(sended).format('DD.MM.YYYY HH:mm')}
          </Text>
        </Text>
        {updated !== sended && (
          <Text fz={{ base: 'xs', sm: 'sm' }}>
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
              {dayjs(updated).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Text>
        )}
      </Stack>

      <Group
        justify="space-between"
        mt="auto"
        gap="xs"
      >
        {status === 'NEW' && ['ADMIN', 'WAREHOUSE'].includes(userRole) && (
          <Button
            variant="light"
            size="xs"
            radius="xl"
            color="blue"
            onClick={handleProcess}
            loading={isProcessing}
            leftSection={<CheckCircle size={16} />}
            flex={{ base: 1, sm: 'none' }}
          >
            Process order
          </Button>
        )}

        {status === 'SENT' && (
          <Button
            variant="light"
            size="xs"
            radius="xl"
            color="green"
            onClick={handleComplete}
            loading={isCompleting}
            leftSection={<CheckCheck size={16} />}
            flex={{ base: 1, sm: 'none' }}
          >
            Accept
          </Button>
        )}

        <Button
          component={Link}
          to={`/orders/${id}`}
          state={{ from: location }}
          variant="subtle"
          size="xs"
          rightSection={<ArrowRight size={14} />}
          style={{
            marginLeft: hasActionBtn ? 0 : 'auto',
          }}
          flex={{
            base: hasActionBtn ? 1 : 'none',
            sm: 'none',
          }}
        >
          To order
        </Button>
      </Group>
    </Card>
  );
};

export default OrderItem;
