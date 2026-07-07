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
  const { data: users = [], isLoading } = useGetAllUsersQuery();

  const [openedEdit, { open: openEdit, close: closeEdit }] = useDisclosure(false);
  const [openedReset, { open: openReset, close: closeReset }] = useDisclosure(false);
  const [openedDelete, { open: openDelete, close: closeDelete }] = useDisclosure(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const columns = useMemo(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'role',
        header: 'Role',
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
        header: 'Store',
        cell: info => <Text>{info.getValue() || 'LOGISTICS'}</Text>,
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: info => {
          const user = info.row.original;
          return (
            <Group gap="xs">
              <Tooltip label="Edit User">
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

              <Tooltip label="Reset Password">
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

              <Tooltip label="Delete User">
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
    [openEdit, openReset, openDelete],
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
