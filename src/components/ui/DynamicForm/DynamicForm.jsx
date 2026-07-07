import {
  Button,
  InputBase,
  Loader,
  MultiSelect,
  NumberInput,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { IMaskInput } from 'react-imask';

const DynamicForm = ({
  title,
  fields = [],
  defaultValues = {},
  onSubmit,
  isLoading,
  submitLabel = 'Submit',
  paperWidth = { base: '100%', sm: 400 },
  gridCols = 1,
}) => {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ defaultValues });

  const formValues = useWatch({ control });

  const handleFormSubmit = async data => {
    await onSubmit(data, reset);
  };

  const renderField = field => {
    if (field.condition && !field.condition(formValues)) return null;

    const commonProps = {
      label: field.label,
      placeholder: field.placeholder,
      withAsterisk: !!field.rules?.required,
      size: 'sm',
      fz: { base: 'md', sm: 'sm' },
      styles: { label: { marginBottom: 8 }, root: { marginBottom: field.mb || 0 } },
      ...field.mantineProps,
    };

    return (
      <Controller
        key={field.name}
        name={field.name}
        control={control}
        rules={field.rules}
        render={({ field: controllerField }) => {
          const errorMsg = errors[field.name]?.message;

          switch (field.type) {
            case 'text':
              return (
                <TextInput
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                />
              );
            case 'password':
              return (
                <PasswordInput
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                />
              );
            case 'number':
              return (
                <NumberInput
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                  hideControls
                  allowNegative={false}
                />
              );
            case 'select':
              return (
                <Select
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                  data={field.options || []}
                  disabled={field.loading || field.disabled}
                  searchable={field.searchable}
                  rightSection={field.loading ? <Loader size="xs" /> : null}
                  value={controllerField.value ? String(controllerField.value) : null}
                />
              );
            case 'multiselect':
              return (
                <MultiSelect
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                  data={field.options || []}
                  disabled={field.loading}
                  searchable
                  clearable
                  rightSection={field.loading ? <Loader size="xs" /> : null}
                />
              );
            case 'mask':
              return (
                <InputBase
                  {...controllerField}
                  {...commonProps}
                  error={errorMsg}
                  component={IMaskInput}
                  mask={field.mask}
                />
              );
            default:
              return null;
          }
        }}
      />
    );
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p={{ base: 'md', sm: 'xl' }}
      mx="auto"
      w={paperWidth}
    >
      {title && (
        <Title
          order={3}
          mb={30}
          ta="center"
        >
          {title}
        </Title>
      )}

      <form onSubmit={handleSubmit(handleFormSubmit)}>
        <Stack gap={25}>
          {gridCols > 1 ? (
            <SimpleGrid
              cols={{ base: 1, sm: gridCols }}
              spacing="lg"
              verticalSpacing="xl"
            >
              {fields.map(renderField)}
            </SimpleGrid>
          ) : (
            fields.map(renderField)
          )}

          <Button
            type="submit"
            fullWidth
            loading={isLoading}
            h={{ base: 46, sm: 40 }}
            fz={{ base: 'md', sm: 'sm' }}
            mt={20}
          >
            {submitLabel}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default DynamicForm;
