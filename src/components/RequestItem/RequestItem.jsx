import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { useUpdateWarehouseRequestStatusMutation } from '../../store/api/api';

const RequestItem = ({ request }) => {
  const [updateStatus, { isLoading }] = useUpdateWarehouseRequestStatusMutation();

  const handleTakeInProgress = async () => {
    try {
      await updateStatus({ id: request.id, status: 'APPROVED' }).unwrap();
      toast.success('Approved!');
    } catch (error) {
      toast.error('Error!');
      console.error(error);
    }
  };

  const formattedDate = dayjs(request.createdAt).format('DD.MM.YYYY HH:mm:ss');
  const showProcessButton = request.status === 'NEW';

  const getStatusColor = status => {
    switch (status) {
      case 'NEW':
        return 'blue';
      case 'APPROVED':
        return 'yellow';
      case 'SENT':
        return 'orange';
      case 'COMPLETED':
        return 'green';
      default:
        return 'gray';
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
        <Badge
          variant="light"
          color="pink"
        >
          {request.category}
        </Badge>
        <Badge color={getStatusColor(request.status)}>{request.status}</Badge>
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
            Created At:{' '}
          </Text>
          <Text
            span
            fw={500}
          >
            {formattedDate}
          </Text>
        </Text>
        <Text size="sm">
          <Text
            span
            c="dimmed"
          >
            Products in order:{' '}
          </Text>
          <Text
            span
            fw={500}
          >
            {request.items?.length || 0}
          </Text>
        </Text>
      </Stack>

      <Group
        justify="space-between"
        mt="auto"
      >
        <Button
          component={Link}
          to={`/requests/${request.id}`}
          variant="light"
          size="sm"
        >
          Details
        </Button>

        {showProcessButton && (
          <Button
            size="sm"
            color="blue"
            onClick={handleTakeInProgress}
            loading={isLoading}
          >
            Approve
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default RequestItem;
