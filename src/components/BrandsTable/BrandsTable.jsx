import { Paper, Table, Text } from '@mantine/core';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import dayjs from 'dayjs';
import { useMemo } from 'react';

const BrandsTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: 'Brand Name',
        cell: info => <Text fw={500}>{info.getValue()}</Text>,
      },
      {
        accessorKey: 'createdAt',
        header: 'Created At',
        cell: info => (
          <Text size="sm">{dayjs(info.getValue()).format('DD.MM.YY HH:mm')}</Text>
        ),
      },
    ],
    [],
  );

  const table = useReactTable({
    data: data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    initialState: {
      sorting: [{ id: 'name', desc: false }],
    },
  });

  return (
    <Paper
      withBorder
      radius="md"
      overflow="hidden"
    >
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
    </Paper>
  );
};

export default BrandsTable;
