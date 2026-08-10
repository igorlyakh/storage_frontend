import { Button, Center, Container, Group, Loader, Stack, Text, Title } from '@mantine/core';
import { QRCodeSVG } from 'qrcode.react';
import { Printer } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useGetReturnByIdQuery } from '../../store/api/api';
import { encodeReturnQr } from '../../utils/returnQr';

const ReturnPrintPage = () => {
  const { t } = useTranslation('returns');
  const { id } = useParams();
  const { data: returnRecord, isLoading } = useGetReturnByIdQuery(id);

  if (isLoading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    );
  }

  if (!returnRecord) return null;

  return (
    <Container
      size="xs"
      py="xl"
    >
      <style>{'@media print { .return-print-actions { display: none; } }'}</style>

      <Stack
        gap="md"
        align="center"
      >
        <Title order={3}>{t('print.title')}</Title>
        <Text
          size="sm"
          c="dimmed"
        >
          {returnRecord.store?.name}
        </Text>

        <QRCodeSVG
          value={encodeReturnQr(returnRecord.id)}
          size={220}
        />

        <Stack
          gap={4}
          align="center"
        >
          {returnRecord.items.map(item => (
            <Text
              key={item.id}
              size="sm"
            >
              {item.product?.name} — {item.quantity}
            </Text>
          ))}
        </Stack>

        <Group className="return-print-actions">
          <Button
            leftSection={<Printer size={16} />}
            onClick={() => window.print()}
          >
            {t('print.printButton')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default ReturnPrintPage;
