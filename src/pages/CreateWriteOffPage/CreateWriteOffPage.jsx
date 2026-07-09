import { Container, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import CreateOrderTable from '../../components/CreateOrderTable/CreateOrderTable';

const CreateWriteOffPage = () => {
  const { t } = useTranslation('orders');

  return (
    <Container
      size="xl"
      py="xl"
    >
      <Title order={2}>{t('writeOffTitle')}</Title>
      <CreateOrderTable writeOff />
    </Container>
  );
};

export default CreateWriteOffPage;
