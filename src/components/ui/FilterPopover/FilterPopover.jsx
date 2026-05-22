import {
  Button,
  Checkbox,
  Divider,
  Group,
  Popover,
  ScrollArea,
  Stack,
} from '@mantine/core';

const FilterPopover = ({ label, options, values, onChange }) => {
  const handleToggle = val => {
    const newValues = values.includes(val)
      ? values.filter(v => v !== val)
      : [...values, val];
    onChange(newValues);
  };

  const handleSelectAll = () => {
    const allValues = options.map(opt => opt.value);
    onChange(allValues);
  };

  const handleClearAll = () => {
    onChange([]);
  };

  return (
    <Popover
      width={250}
      position="bottom-start"
      shadow="md"
      withArrow
    >
      <Popover.Target>
        <Button
          variant="default"
          w={{ base: '100%', sm: 200 }}
          style={{ fontWeight: 500 }}
        >
          {values.length > 0 ? `${label} (${values.length})` : `All ${label}`}
        </Button>
      </Popover.Target>

      <Popover.Dropdown p="sm">
        <Stack gap="xs">
          <Group
            grow
            gap="xs"
          >
            <Button
              size="xs"
              variant="light"
              color="blue"
              onClick={handleSelectAll}
            >
              Select All
            </Button>
            <Button
              size="xs"
              variant="light"
              color="gray"
              onClick={handleClearAll}
              disabled={values.length === 0}
            >
              Clear
            </Button>
          </Group>

          <Divider my="xs" />

          <ScrollArea.Autosize
            mah={220}
            type="scroll"
          >
            <Stack gap="sm">
              {options.map(opt => (
                <Checkbox
                  key={opt.value}
                  label={opt.label}
                  checked={values.includes(opt.value)}
                  onChange={() => handleToggle(opt.value)}
                />
              ))}
            </Stack>
          </ScrollArea.Autosize>
        </Stack>
      </Popover.Dropdown>
    </Popover>
  );
};

export default FilterPopover;
