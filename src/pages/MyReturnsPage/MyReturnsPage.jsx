import { Anchor, Box, Button, Container, Group, LoadingOverlay, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { Plus } from 'lucide-react';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import DataTable from '../../components/ui/DataTable';
import ReturnStatusBadge from '../../components/ui/ReturnStatusBadge';
import { useGetMyReturnsQuery } from '../../store/api/api';

const MyReturnsPage = () => {
  const { t } = useTranslation('returns');
  const { data: returns = [], isLoading } = useGetMyReturnsQuery();

  const columns = useMemo(
    () => [
      {
        accessorKey: 'createdAt',
        header: t('list.columns.date'),
        cell: info => <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>,
      },
      {
        id: 'itemsCount',
        header: t('list.columns.items'),
        accessorFn: row => row.items?.length || 0,
      },
      {
        accessorKey: 'status',
        header: t('list.columns.status'),
        cell: info => <ReturnStatusBadge status={info.getValue()} />,
      },
      {
        id: 'actions',
        header: '',
        cell: info => (
          <Anchor
            component={Link}
            to={`/returns/${info.row.original.id}`}
            size="sm"
          >
            {t('list.viewDetails')}
          </Anchor>
        ),
      },
    ],
    [t],
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
          <Title order={2}>{t('list.myTitle')}</Title>
          <Button
            component={Link}
            to="/returns/create"
            leftSection={<Plus size={16} />}
          >
            {t('list.createReturn')}
          </Button>
        </Group>

        <DataTable
          data={returns}
          columns={columns}
        />
      </Box>
    </Container>
  );
};

export default MyReturnsPage;
