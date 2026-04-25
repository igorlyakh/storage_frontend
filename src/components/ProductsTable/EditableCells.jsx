import { Badge, Group, MultiSelect, NumberInput, Text, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';
import getBrandColor from '../../utils/getBrandColor';

export const EditableTextCell = ({ initialValue, onUpdate }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <TextInput
      value={value}
      onChange={e => setValue(e.currentTarget.value)}
      onBlur={() => {
        if (value !== initialValue) onUpdate(value);
      }}
      variant="unstyled"
      styles={{ input: { padding: 0, height: 'auto', minHeight: 'auto' } }}
    />
  );
};

export const EditableNumberCell = ({ initialValue, onUpdate }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <NumberInput
      value={value === null ? '' : value}
      onChange={val => setValue(val === '' ? null : Number(val))}
      onBlur={() => {
        if (value !== initialValue) {
          const valueToSend = value === 0 ? null : value;
          onUpdate(valueToSend);
        }
      }}
      variant="unstyled"
      hideControls
      placeholder="No limit"
      styles={{ input: { padding: 0, height: 'auto', minHeight: 'auto' } }}
    />
  );
};

export const EditableOrderCell = ({ initialValue, max, onUpdate }) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  return (
    <NumberInput
      value={value === null ? '' : value}
      onChange={val => setValue(val === '' ? null : Number(val))}
      onBlur={() => {
        if (value !== initialValue) onUpdate(value);
      }}
      min={0}
      max={max || undefined}
      allowNegative={false}
      placeholder="0"
      w={100}
      styles={{
        input: {
          backgroundColor: value > 0 ? 'var(--mantine-color-green-0)' : undefined,
          fontWeight: value > 0 ? 'bold' : 'normal',
        },
      }}
    />
  );
};

export const EditableBrandsCell = ({ initialBrands = [], allBrands = [], onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState([]);

  const handleStartEdit = () => {
    setValue(initialBrands.map(b => String(b.id)));
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);

    const initialIds = initialBrands
      .map(b => String(b.id))
      .sort()
      .join(',');

    const currentIds = [...value].sort().join(',');

    if (initialIds !== currentIds) {
      onUpdate(value);
    }
  };

  if (isEditing) {
    return (
      <MultiSelect
        data={allBrands.map(b => ({ value: String(b.id), label: b.name }))}
        value={value}
        onChange={setValue}
        onDropdownClose={handleSave}
        searchable
        autoFocus
        placeholder="Select brands..."
        styles={{ input: { minWidth: 200 } }}
      />
    );
  }

  return (
    <Group
      gap={5}
      onClick={handleStartEdit}
      style={{ cursor: 'pointer', minHeight: 28, padding: '2px', borderRadius: '4px' }}
    >
      {initialBrands.length > 0 ? (
        initialBrands.map(brand => (
          <Badge
            key={brand.id}
            variant="light"
            size="sm"
            color={getBrandColor(brand.name)}
          >
            {brand.name}
          </Badge>
        ))
      ) : (
        <Text
          size="xs"
          c="dimmed"
          style={{ borderBottom: '1px dashed' }}
        >
          Add brands...
        </Text>
      )}
    </Group>
  );
};
