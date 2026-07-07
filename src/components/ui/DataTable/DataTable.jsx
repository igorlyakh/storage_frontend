import { Paper, Stack, Table, Text } from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Inbox } from 'lucide-react';

const DataTable = ({ data, columns, initialState = {} }) => {
  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState,
  });

  return (
    <Paper
      withBorder
      radius="lg"
      shadow="xs"
      style={{ overflow: 'hidden' }}
    >
      <Table.ScrollContainer minWidth={500}>
        <Table
          verticalSpacing="md"
          horizontalSpacing="lg"
          highlightOnHover
        >
          <Table.Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <Table.Th
                    key={header.id}
                    style={{
                      backgroundColor: 'var(--mantine-color-gray-0)',
                      borderBottom: '1px solid var(--mantine-color-gray-3)',
                      textTransform: 'uppercase',
                      fontSize: 11,
                      letterSpacing: 0.5,
                      color: 'var(--mantine-color-gray-6)',
                      fontWeight: 700,
                    }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </Table.Th>
                ))}
              </Table.Tr>
            ))}
          </Table.Thead>
          <Table.Tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map(cell => (
                    <Table.Td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </Table.Td>
                  ))}
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td
                  colSpan={columns.length}
                  py="xl"
                >
                  <Stack
                    align="center"
                    gap={4}
                  >
                    <Inbox
                      size={28}
                      color="var(--mantine-color-gray-4)"
                    />
                    <Text
                      c="dimmed"
                      size="sm"
                    >
                      No records found
                    </Text>
                  </Stack>
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
};

export default DataTable;
