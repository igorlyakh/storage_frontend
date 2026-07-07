import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { ActionIcon, Group, Text } from '@mantine/core';
import { GripVertical } from 'lucide-react';

const SortableRow = ({ id, label, sublabel }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    border: '1px solid var(--mantine-color-gray-3)',
    borderRadius: 6,
  };

  return (
    <Group
      ref={setNodeRef}
      style={style}
      wrap="nowrap"
      gap="xs"
      p="xs"
      bg="white"
    >
      <ActionIcon
        variant="subtle"
        color="gray"
        style={{ cursor: 'grab', touchAction: 'none' }}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </ActionIcon>
      <div style={{ minWidth: 0 }}>
        <Text
          size="sm"
          fw={500}
          truncate
        >
          {label}
        </Text>
        {sublabel && (
          <Text
            size="xs"
            c="dimmed"
            truncate
          >
            {sublabel}
          </Text>
        )}
      </div>
    </Group>
  );
};

export default SortableRow;
