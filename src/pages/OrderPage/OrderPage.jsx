import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { ArrowLeft, Ban, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import OrderItemsTable from '../../components/OrderItemsTable/OrderItemsTable';
import { useGetOrderByIdQuery } from '../../store/api/api';

const OrderPage = () => {
  const { t } = useTranslation('orders');
  const { id } = useParams();
  const { data: order, isLoading } = useGetOrderByIdQuery(id);
  const navigate = useNavigate();
  const location = useLocation();

  const backLinkPath = location.state?.from ?? '/';

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

  return (
    <Container
      size="xl"
      py="md"
    >
      <Stack gap="lg">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<ArrowLeft size={16} />}
          onClick={() => navigate(backLinkPath)}
          style={{ alignSelf: 'flex-start', paddingLeft: 0 }}
        >
          {t('detail.backToOrders')}
        </Button>

        <Stack gap="sm">
          <Title order={2}>{t('detail.orderDetails')}</Title>

          <Group gap="sm">
            <Badge
              color="yellow"
              size="md"
            >
              {order?.store?.name}
            </Badge>
            {order?.status && (
              <Badge
                color={order.status === 'REJECTED' ? 'red' : 'blue'}
                variant="light"
                size="md"
              >
                {t(`status.${order.status}`, order.status.replace('_', ' '))}
              </Badge>
            )}
            {order?.recipientRole === 'ADMIN' && order?.recipientScope && (
              <Badge
                variant="light"
                color="pink"
                size="md"
              >
                {order.recipientScope}
              </Badge>
            )}
          </Group>

          {order?.status === 'REJECTED' && order?.rejectionReason && (
            <Alert
              color="red"
              icon={<Ban size={18} />}
              title={t('detail.rejectionReason')}
              radius="md"
            >
              {order.rejectionReason}
            </Alert>
          )}

          {order?.name && (
            <Group
              gap="md"
              align="center"
              mt="xs"
            >
              <ThemeIcon
                variant="light"
                color="blue"
                size="xl"
                radius="xl"
              >
                <User size={24} />
              </ThemeIcon>
              <div>
                <Text
                  size="sm"
                  c="dimmed"
                  lh={1.2}
                >
                  {t('detail.orderedBy')}
                </Text>
                <Text
                  fw={500}
                  size="lg"
                  lh={1.5}
                >
                  {order.name}
                </Text>
              </div>
            </Group>
          )}
        </Stack>

        {order && <OrderItemsTable order={order} />}
      </Stack>
    </Container>
  );
};

export default OrderPage;
