import { Alert, Box, Modal, Text } from '@mantine/core';
import { Html5Qrcode } from 'html5-qrcode';
import { CircleAlert } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SCANNER_ELEMENT_ID = 'qr-scanner-region';

const QrScannerModal = ({ opened, onClose, onDecode }) => {
  const { t } = useTranslation('returns');
  const scannerRef = useRef(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!opened) return undefined;

    setError(null);
    const scanner = new Html5Qrcode(SCANNER_ELEMENT_ID);
    scannerRef.current = scanner;
    let stopped = false;

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        decodedText => {
          if (stopped) return;
          stopped = true;
          onDecode(decodedText);
        },
        () => {},
      )
      .catch(() => setError(t('scanner.cameraError')));

    return () => {
      stopped = true;
      scanner.stop().catch(() => {}).finally(() => scanner.clear());
    };
  }, [opened, onDecode, t]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('scanner.title')}
      centered
      size={{ base: '95%', sm: 420 }}
    >
      {error ? (
        <Alert
          color="red"
          icon={<CircleAlert size={18} />}
        >
          {error}
        </Alert>
      ) : (
        <Text
          size="sm"
          c="dimmed"
          mb="sm"
        >
          {t('scanner.hint')}
        </Text>
      )}
      <Box
        id={SCANNER_ELEMENT_ID}
        style={{ width: '100%', minHeight: 250 }}
      />
    </Modal>
  );
};

export default QrScannerModal;
