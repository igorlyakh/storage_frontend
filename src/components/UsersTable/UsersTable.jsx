import { ActionIcon, Badge, Group, Paper, Table, Text, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Key, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';

import DeleteUserModal from './DeleteUserModal';
import ResetPasswordModal from './ResetPasswordModal';

const roleSortOrder = {
  ADMIN: 1,
  WAREHOUSE: 2,
  STORE: 3,
};

const UsersTable = ({ data }) => {
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
    [openReset, openDelete],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    initialState: {
      sorting: [{ id: 'role', desc: false }],
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  return (
    <>
      <Paper
        withBorder
        radius="md"
        overflow="hidden"
        mt="md"
      >
        <Table.ScrollContainer minWidth={600}>
          <Table
            verticalSpacing="sm"
            highlightOnHover
          >
            <Table.Thead bg="gray.0">
              {table.getHeaderGroups().map(headerGroup => (
                <Table.Tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <Table.Th key={header.id}>
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  ))}
                </Table.Tr>
              ))}
            </Table.Thead>

            <Table.Tbody>
              {table.getRowModel().rows.map(row => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Table.ScrollContainer>
      </Paper>

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
    </>
  );
};

export default UsersTable;
