import { ActionIcon, Badge, Button, Card, Group, Stack, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import { Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  useDeleteWarehouseRequestMutation,
  useUpdateWarehouseRequestStatusMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

const RequestItem = ({ request }) => {
  const { t } = useTranslation('requests');
  const [updateStatus, { isLoading }] = useUpdateWarehouseRequestStatusMutation();
  const [deleteRequest, { isLoading: isDeleting }] = useDeleteWarehouseRequestMutation();
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

  const handleDelete = () => {
    modals.openConfirmModal({
      title: t('card.deleteTitle'),
      centered: true,
      children: <Text size="sm">{t('card.deleteConfirm')}</Text>,
      labels: { confirm: t('card.deleteAction'), cancel: t('card.deleteCancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteRequest(request.id).unwrap();
          toast.success(t('card.deleted'));
        } catch (error) {
          toast.error(getApiErrorMessage(t, error, 'card.deleteError'));
        }
      },
    });
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
        <Text fz={{ base: 'xs', sm: 'sm' }}>
          <Text
            span
            c="dimmed"
          >
            {t('card.source')}{' '}
          </Text>
          <Text
            span
            fw={500}
          >
            {request.sourceWarehouse?.name || t('card.externalSupplier')}
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

        {userRole === 'ADMIN' && (
          <Tooltip label={t('card.deleteTitle')}>
            <ActionIcon
              variant="light"
              color="red"
              size="lg"
              onClick={handleDelete}
              loading={isDeleting}
            >
              <Trash size={16} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>
    </Card>
  );
};

export default RequestItem;
