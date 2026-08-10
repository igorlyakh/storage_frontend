import { Box, Button, Container, Group, LoadingOverlay, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import dayjs from 'dayjs';
import { ScanLine } from 'lucide-react';
import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/ui/DataTable';
import QrScannerModal from '../../components/ui/QrScannerModal';
import { useGetDriverReturnsQuery, usePickupReturnMutation } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';
import { decodeReturnQr } from '../../utils/returnQr';

const DriverReturnsPage = () => {
  const { t } = useTranslation('returns');
  const { data: returns = [], isLoading } = useGetDriverReturnsQuery();
  const [pickupReturn, { isLoading: isPickingUp }] = usePickupReturnMutation();
  const [openedScanner, { open: openScanner, close: closeScanner }] = useDisclosure(false);

  const handlePickup = async id => {
    try {
      await pickupReturn(id).unwrap();
      toast.success(t('driver.pickedUp'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'driver.pickupFailed'));
    }
  };

  const handleDecode = async text => {
    closeScanner();
    await handlePickup(decodeReturnQr(text));
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: 'approvedAt',
        header: t('list.columns.date'),
        cell: info => (
          <Text size="sm">
            {info.getValue() ? dayjs(info.getValue()).format('DD.MM.YY HH:mm') : ''}
          </Text>
        ),
      },
      {
        id: 'store',
        header: t('list.columns.store'),
        accessorFn: row => row.store?.name || '',
      },
      {
        id: 'itemsCount',
        header: t('list.columns.items'),
        accessorFn: row => row.items?.length || 0,
      },
      {
        id: 'actions',
        header: '',
        cell: info => (
          <Button
            size="xs"
            loading={isPickingUp}
            onClick={() => handlePickup(info.row.original.id)}
          >
            {t('driver.markReceived')}
          </Button>
        ),
      },
    ],
    [t, isPickingUp],
  );

  return (
    <Container
      size="xl"
      py="xl"
    >
      <Box
        pos="relative"
        mih={200}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2 }}
        />

        <Group
          justify="space-between"
          mb="md"
        >
          <Title order={2}>{t('driver.title')}</Title>
          <Button
            leftSection={<ScanLine size={16} />}
            onClick={openScanner}
          >
            {t('driver.scanButton')}
          </Button>
        </Group>

        <DataTable
          data={returns}
          columns={columns}
        />
      </Box>

      <QrScannerModal
        opened={openedScanner}
        onClose={closeScanner}
        onDecode={handleDecode}
      />
    </Container>
  );
};

export default DriverReturnsPage;
