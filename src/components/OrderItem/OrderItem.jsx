import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Group,
  Modal,
  Stack,
  Text,
  Textarea,
  Tooltip,
} from '@mantine/core';
import { modals } from '@mantine/modals';
import dayjs from 'dayjs';
import { ArrowRight, Ban, CheckCheck, CheckCircle, Trash } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import {
  useCompleteOrderMutation,
  useDeleteOrderMutation,
  useProcessOrderMutation,
  useRejectOrderMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

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
    case 'BACKORDER':
      return 'purple';
    case 'REJECTED':
      return 'red';
    default:
      return 'gray';
  }
};

const OrderItem = ({ store, status, sended, updated, rejectionReason, recipientScope, id }) => {
  const { t } = useTranslation('orders');
  const location = useLocation();
  const userRole = useSelector(userRoleSelector);

  const [processOrder, { isLoading: isProcessing }] = useProcessOrderMutation();
  const [completeOrder, { isLoading: isCompleting }] = useCompleteOrderMutation();
  const [deleteOrder, { isLoading: isDeleting }] = useDeleteOrderMutation();
  const [rejectOrder, { isLoading: isRejecting }] = useRejectOrderMutation();

  const [rejectOpened, setRejectOpened] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleProcess = async () => {
    try {
      await processOrder({ orderId: id }).unwrap();
      toast.success(t('card.processed'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'card.processError'));
    }
  };

  const handleDelete = () => {
    modals.openConfirmModal({
      title: t('card.deleteTitle'),
      centered: true,
      children: <Text size="sm">{t('card.deleteConfirm', { store })}</Text>,
      labels: { confirm: t('card.deleteAction'), cancel: t('card.deleteCancel') },
      confirmProps: { color: 'red' },
      onConfirm: async () => {
        try {
          await deleteOrder(id).unwrap();
          toast.success(t('card.deleted'));
        } catch (error) {
          toast.error(getApiErrorMessage(t, error, 'card.deleteError'));
        }
      },
    });
  };

  const handleComplete = async () => {
    try {
      await completeOrder(id).unwrap();
      toast.success(t('card.completed'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'card.completeError'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error(t('card.rejectReasonRequired'));
      return;
    }
    try {
      await rejectOrder({ orderId: id, reason: rejectReason.trim() }).unwrap();
      toast.success(t('card.rejected'));
      setRejectOpened(false);
      setRejectReason('');
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'card.rejectError'));
    }
  };

  const canReject =
    ['ADMIN', 'WAREHOUSE'].includes(userRole) &&
    ['NEW', 'IN_PROGRESS', 'BACKORDER'].includes(status);

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
            {t('card.from')}{' '}
          </Text>
          {store}
        </Text>
        <Group gap={6}>
          {recipientScope && (
            <Badge
              variant="light"
              color="pink"
              size="sm"
            >
              {recipientScope}
            </Badge>
          )}
          <Badge
            color={getStatusColor(status)}
            size="sm"
          >
            {t(`status.${status}`, status.replace('_', ' '))}
          </Badge>
        </Group>
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
            {t('card.sended')}{' '}
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
              {t('card.updated')}{' '}
            </Text>
            <Text
              span
              fw={500}
            >
              {dayjs(updated).format('DD.MM.YYYY HH:mm')}
            </Text>
          </Text>
        )}
        {status === 'REJECTED' && rejectionReason && (
          <Text
            fz={{ base: 'xs', sm: 'sm' }}
            lineClamp={2}
          >
            <Text
              span
              c="red.7"
              fw={600}
            >
              {t('card.rejectionReason')}{' '}
            </Text>
            <Text span>{rejectionReason}</Text>
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
            {t('card.processOrder')}
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
            {t('card.accept')}
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
          {t('card.toOrder')}
        </Button>

        {canReject && (
          <Tooltip label={t('card.rejectTitle')}>
            <ActionIcon
              variant="light"
              color="orange"
              size="sm"
              onClick={() => setRejectOpened(true)}
            >
              <Ban size={14} />
            </ActionIcon>
          </Tooltip>
        )}

        {userRole === 'ADMIN' && (
          <Tooltip label={t('card.deleteTitle')}>
            <ActionIcon
              variant="light"
              color="red"
              size="sm"
              onClick={handleDelete}
              loading={isDeleting}
            >
              <Trash size={14} />
            </ActionIcon>
          </Tooltip>
        )}
      </Group>

      <Modal
        opened={rejectOpened}
        onClose={() => setRejectOpened(false)}
        title={t('card.rejectTitle')}
        centered
      >
        <Stack gap="md">
          <Textarea
            label={t('card.rejectReasonLabel')}
            placeholder={t('card.rejectReasonPlaceholder')}
            autosize
            minRows={3}
            maxLength={500}
            data-autofocus
            value={rejectReason}
            onChange={event => setRejectReason(event.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button
              variant="default"
              onClick={() => setRejectOpened(false)}
            >
              {t('card.deleteCancel')}
            </Button>
            <Button
              color="red"
              leftSection={<Ban size={16} />}
              loading={isRejecting}
              disabled={!rejectReason.trim()}
              onClick={handleReject}
            >
              {t('card.rejectAction')}
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default OrderItem;
