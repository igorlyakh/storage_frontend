import {
  ActionIcon,
  Badge,
  Box,
  Container,
  Group,
  LoadingOverlay,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Key, Pencil, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DataTable from '../../components/ui/DataTable';
import DeleteUserModal from '../../components/ui/DeleteUserModal';
import EditUserModal from '../../components/ui/EditUserModal';
import ResetPasswordModal from '../../components/ui/ResetPasswordModal';
import { useGetAllUsersQuery } from '../../store/api/api';

const roleSortOrder = {
  ADMIN: 1,
  WAREHOUSE: 2,
  STORE: 3,
};

const UsersPage = () => {
  const { t } = useTranslation('users');
  const { data: users = [], isLoading } = useGetAllUsersQuery();

  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedReset, { open: openReset, close: closeReset }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: t('columns.username'),
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'role',
        header: t('columns.role'),
        sortingFn: (rowA, rowB, columnId) => {
          const valA = rowA.getValue(columnId);
          const valB = rowB.getValue(columnId);
          const rankA = roleSortOrder[valA] || 4;
          const rankB = roleSortOrder[valB] || 4;
          return rankA - rankB;
        },
        cell: info => {
          const val = info.getValue();
          let color = 'blue';
          if (val === 'ADMIN') color = 'red';
          if (val === 'WAREHOUSE') color = 'orange';

          return (
            <Badge
              color={color}
              variant="light"
            >
              {val}
            </Badge>
          );
        },
      },
      {
        accessorKey: 'store.name',
        header: t('columns.store'),
        cell: info => <Text>{info.getValue() || t('columns.logistics')}</Text>,
      },
      {
        id: 'actions',
        header: t('columns.actions'),
        cell: info => {
          const user = info.row.original;
          return (
            <Group gap="xs">
              <Tooltip label={t('tooltips.editUser')}>
                <ActionIcon
                  variant="light"
                  color="grape"
                  onClick={() => {
                    setSelectedUser(user);
                    openEdit();
                  }}
                >
                  <Pencil size={16} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={t('tooltips.resetPassword')}>
                <ActionIcon
                  variant="light"
                  color="blue"
                  onClick={() => {
                    setSelectedUser(user);
                    openReset();
                  }}
                >
                  <Key size={16} />
                </ActionIcon>
              </Tooltip>

              <Tooltip label={t('tooltips.deleteUser')}>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => {
                    setSelectedUser(user);
                    openDelete();
                  }}
                >
                  <Trash size={16} />
                </ActionIcon>
              </Tooltip>
            </Group>
          );
        },
      },
    ],
    [openEdit, openReset, openDelete, t],
  );

  return (
    <Container
      size="xl"
      py="xl"
    >
      <Box
        pos="relative"
        minHeight={200}
      >
        <LoadingOverlay
          visible={isLoading}
          overlayProps={{ blur: 2 }}
        />

        <DataTable
          data={users}
          columns={columns}
          initialState={{ sorting: [{ id: 'role', desc: false }] }}
        />
      </Box>

      <EditUserModal
        opened={openedEdit}
        onClose={closeEdit}
        user={selectedUser}
      />

      <ResetPasswordModal
        opened={openedReset}
        onClose={closeReset}
        user={selectedUser}
      />

      <DeleteUserModal
        opened={openedDelete}
        onClose={closeDelete}
        user={selectedUser}
      />
    </Container>
  );
};

export default UsersPage;
