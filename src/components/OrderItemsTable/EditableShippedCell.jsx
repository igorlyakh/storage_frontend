import { NumberInput } from '@mantine/core';
import { useEffect, useState } from 'react';

const EditableShippedCell = ({ initialValue, onUpdate, disabled }) => {
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
      disabled={disabled}
      min={0}
      allowNegative={false}
      hideControls
      w={{ base: 80, sm: 120 }}
      size={{ base: 'xs', sm: 'sm' }}
    />
  );
};

export default EditableShippedCell;
