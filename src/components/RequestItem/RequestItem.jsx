import { Badge, Button, Card, Group, Stack, Text } from '@mantine/core';
import dayjs from 'dayjs';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useUpdateWarehouseRequestStatusMutation } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const RequestItem = ({ request }) => {
  const { t } = useTranslation('requests');
  const [updateStatus, { isLoading }] = useUpdateWarehouseRequestStatusMutation();
  const userRole = useSelector(userRoleSelector);

  const handleTakeInProgress = async () => {
    try {
      await updateStatus({ id: request.id, status: 'APPROVED' }).unwrap();
      toast.success(t('card.approved'));
    } catch (error) {
      toast.error(t('card.approveError'));
      console.error(error);
    }
  };

  const formattedDate = dayjs(request.createdAt).format('DD.MM.YYYY HH:mm:ss');
  const showProcessButton = request.status === 'NEW' && userRole === 'ADMIN';

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
      padding={{ base: 'sm', sm: 'md' }}
      display="flex"
      style={{ flexDirection: 'column' }}
    >
      <Group
        justify="space-between"
        mb={{ base: 'xs', sm: 'sm' }}
      >
        <Badge
          variant="light"
          color="pink"
          size="sm"
        >
          {request.category}
        </Badge>
        <Badge
          color={getStatusColor(request.status)}
          size="sm"
        >
          {t(`status.${request.status}`, request.status)}
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
            {t('card.createdAt')}{' '}
          </Text>
          <Text
            span
            fw={500}
          >
            {formattedDate}
          </Text>
        </Text>
        <Text fz={{ base: 'xs', sm: 'sm' }}>
          <Text
            span
            c="dimmed"
          >
            {t('card.productsInOrder')}{' '}
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
        gap="xs"
        wrap="nowrap"
      >
        <Button
          component={Link}
          to={`/requests/${request.id}`}
          variant="light"
          size="sm"
          flex={1}
        >
          {t('card.details')}
        </Button>

        {showProcessButton && (
          <Button
            size="sm"
            color="blue"
            onClick={handleTakeInProgress}
            loading={isLoading}
            flex={1}
          >
            {t('card.approve')}
          </Button>
        )}
      </Group>
    </Card>
  );
};

export default RequestItem;
