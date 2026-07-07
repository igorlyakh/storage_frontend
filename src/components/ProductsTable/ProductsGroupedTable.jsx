import { Badge, Group, Paper, Table, Text } from '@mantine/core';
import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ProductsGroupedTable = ({ table }) => {
  'use no memo';

  return (
    <Paper
      withBorder
      radius="lg"
      shadow="xs"
      overflow="hidden"
    >
      <Table.ScrollContainer minWidth={1000}>
        <Table
          verticalSpacing="xs"
          highlightOnHover
          layout="fixed"
        >
          <Table.Thead>
            {table.getHeaderGroups().map(headerGroup => (
              <Table.Tr key={headerGroup.id}>
                {headerGroup.headers.map(header => {
                  if (header.id === 'category') return null;
                  const isNameCol = header.id === 'name';

                  return (
                    <Table.Th
                      key={header.id}
                      style={{
                        width: isNameCol ? '100%' : header.getSize(),
                        minWidth: isNameCol ? 300 : header.getSize(),
                        backgroundColor: 'var(--mantine-color-gray-0)',
                        borderBottom: '1px solid var(--mantine-color-gray-3)',
                        textTransform: 'uppercase',
                        fontSize: 11,
                        letterSpacing: 0.5,
                        color: 'var(--mantine-color-gray-6)',
                        fontWeight: 700,
                        ...(isNameCol
                          ? {
                              position: 'sticky',
                              left: 0,
                              zIndex: 2,
                              boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                            }
                          : undefined),
                      }}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                    </Table.Th>
                  );
                })}
              </Table.Tr>
            ))}
          </Table.Thead>

          <Table.Tbody>
            {table.getRowModel().rows.map(row => {
              if (row.getIsGrouped()) {
                return (
                  <Table.Tr
                    key={row.id}
                    bg="blue.0"
                    style={{ borderLeft: '3px solid var(--mantine-color-blue-5)' }}
                  >
                    <Table.Td colSpan={row.getVisibleCells().length}>
                      <Group
                        gap="xs"
                        onClick={row.getToggleExpandedHandler()}
                        style={{ cursor: 'pointer', userSelect: 'none' }}
                      >
                        {row.getIsExpanded() ? (
                          <ChevronDown size={18} />
                        ) : (
                          <ChevronRight size={18} />
                        )}
                        <Text
                          fw={700}
                          size="md"
                          c="blue.9"
                        >
                          {row.groupingValue}
                        </Text>
                        <Badge
                          color="blue"
                          variant="light"
                          size="sm"
                          circle
                        >
                          {row.subRows.length}
                        </Badge>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                );
              }

              return (
                <Table.Tr key={row.id}>
                  {row.getVisibleCells().map(cell => {
                    if (cell.column.id === 'category') return null;
                    const isNameCol = cell.column.id === 'name';

                    return (
                      <Table.Td
                        key={cell.id}
                        style={
                          isNameCol
                            ? {
                                position: 'sticky',
                                left: 0,
                                zIndex: 1,
                                backgroundColor: 'var(--mantine-color-body)',
                                boxShadow: '2px 0 5px -2px rgba(0,0,0,0.1)',
                              }
                            : undefined
                        }
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </Table.Td>
                    );
                  })}
                </Table.Tr>
              );
            })}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    </Paper>
  );
};

export default ProductsGroupedTable;
