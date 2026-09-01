import {
  Alert,
  Avatar,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Image,
  Loader,
  Modal,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Ban, Check, Image as ImageIcon, Printer } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import PhotoLightbox from '../../components/ui/PhotoLightbox';
import ReturnStatusBadge from '../../components/ui/ReturnStatusBadge';
import {
  useApproveReturnMutation,
  useGetReturnByIdQuery,
  useRejectReturnMutation,
} from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';
import { getApiErrorMessage } from '../../utils/apiError';

const ReturnPage = () => {
  const { t } = useTranslation('returns');
  const { id } = useParams();
  const role = useSelector(userRoleSelector);
  const { data: returnRecord, isLoading } = useGetReturnByIdQuery(id);
  const [approveReturn, { isLoading: isApproving }] = useApproveReturnMutation();
  const [rejectReturn, { isLoading: isRejecting }] = useRejectReturnMutation();

  const [rejectOpened, { open: openReject, close: closeReject }] = useDisclosure(false);
  const [rejectReason, setRejectReason] = useState('');
  const [lightboxSrc, setLightboxSrc] = useState(null);

  const handleApprove = async () => {
    try {
      await approveReturn(id).unwrap();
      toast.success(t('detail.approved'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'detail.approveFailed'));
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return toast.error(t('detail.rejectReasonRequired'));
    }
    try {
      await rejectReturn({ id, reason: rejectReason.trim() }).unwrap();
      toast.success(t('detail.rejected'));
      closeReject();
      setRejectReason('');
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'detail.rejectFailed'));
    }
  };

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

  if (!returnRecord) return null;

  const canPrint = ['APPROVED', 'IN_TRANSIT', 'COMPLETED'].includes(returnRecord.status);

  return (
    <Container
      size="lg"
      py="xl"
    >
      <Stack gap="lg">
        <Group justify="space-between">
          <Stack gap={4}>
            <Title order={2}>{t('detail.title')}</Title>
            <Group gap="sm">
              <Badge
                color="yellow"
                variant="light"
              >
                {returnRecord.store?.name}
              </Badge>
              <ReturnStatusBadge status={returnRecord.status} />
            </Group>
          </Stack>

          {canPrint && (
            <Button
              component={Link}
              to={`/returns/${id}/print`}
              target="_blank"
              variant="light"
              leftSection={<Printer size={16} />}
            >
              {t('detail.printQr')}
            </Button>
          )}
        </Group>

        {returnRecord.status === 'REJECTED' && returnRecord.rejectionReason && (
          <Alert
            color="red"
            icon={<Ban size={18} />}
            title={t('detail.rejectionReason')}
            radius="md"
          >
            {returnRecord.rejectionReason}
          </Alert>
        )}

        <Table verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th>{t('detail.columns.photo')}</Table.Th>
              <Table.Th>{t('detail.columns.product')}</Table.Th>
              <Table.Th>{t('detail.columns.quantity')}</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {returnRecord.items.map(item => (
              <Table.Tr key={item.id}>
                <Table.Td>
                  {item.photoUrl ? (
                    <Image
                      src={item.photoUrl}
                      w={56}
                      h={56}
                      radius="sm"
                      fit="cover"
                      style={{ cursor: 'zoom-in' }}
                      onClick={() => setLightboxSrc(item.photoUrl)}
                    />
                  ) : (
                    <Avatar radius="sm">
                      <ImageIcon size={16} />
                    </Avatar>
                  )}
                </Table.Td>
                <Table.Td>
                  {item.product?.name || item.customName}
                  {!item.productId && (
                    <Badge
                      ml="xs"
                      size="xs"
                      variant="light"
                      color="grape"
                    >
                      {t('detail.customItem')}
                    </Badge>
                  )}
                </Table.Td>
                <Table.Td>{item.quantity}</Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>

        {role === 'ADMIN' && returnRecord.status === 'PENDING' && (
          <Group>
            <Button
              color="green"
              leftSection={<Check size={16} />}
              loading={isApproving}
              onClick={handleApprove}
            >
              {t('detail.approve')}
            </Button>
            <Button
              color="red"
              variant="light"
              leftSection={<Ban size={16} />}
              onClick={openReject}
            >
              {t('detail.reject')}
            </Button>
          </Group>
        )}
      </Stack>

      <Modal
        opened={rejectOpened}
        onClose={closeReject}
        title={t('detail.reject')}
        centered
      >
        <Stack gap="md">
          <Textarea
            label={t('detail.rejectReasonLabel')}
            placeholder={t('detail.rejectReasonPlaceholder')}
            autosize
            minRows={3}
            maxLength={500}
            data-autofocus
            value={rejectReason}
            onChange={event => setRejectReason(event.currentTarget.value)}
          />
          <Group justify="flex-end">
            <Button
              variant="light"
              color="gray"
              onClick={closeReject}
            >
              {t('common:actions.cancel')}
            </Button>
            <Button
              color="red"
              leftSection={<Ban size={16} />}
              loading={isRejecting}
              disabled={!rejectReason.trim()}
              onClick={handleReject}
            >
              {t('detail.reject')}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <PhotoLightbox
        src={lightboxSrc}
        onClose={() => setLightboxSrc(null)}
      />
    </Container>
  );
};

export default ReturnPage;
