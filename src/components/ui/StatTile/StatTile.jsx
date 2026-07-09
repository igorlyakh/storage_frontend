import { Group, Paper, Text, ThemeIcon } from '@mantine/core';

const StatTile = ({ label, value, icon: Icon, color = 'blue' }) => {
  return (
    <Paper
      withBorder
      radius="md"
      p="md"
    >
      <Group
        justify="space-between"
        align="flex-start"
        wrap="nowrap"
      >
        <div>
          <Text
            size="xs"
            c="dimmed"
            tt="uppercase"
            fw={700}
          >
            {label}
          </Text>
          <Text
            size="xl"
            fw={700}
            mt={4}
          >
            {value}
          </Text>
        </div>
        {Icon && (
          <ThemeIcon
            variant="light"
            color={color}
            size="lg"
            radius="md"
          >
            <Icon size={18} />
          </ThemeIcon>
        )}
      </Group>
    </Paper>
  );
};

export default StatTile;
