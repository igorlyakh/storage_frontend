import { NumberInput, TextInput } from '@mantine/core';
import { useEffect, useState } from 'react';

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
