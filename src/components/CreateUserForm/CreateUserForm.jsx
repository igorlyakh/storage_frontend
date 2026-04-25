import {
  Button,
  Loader,
  MultiSelect, // Добавили импорт MultiSelect
  Paper,
  Select,
  Stack,
  Title,
} from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateUserMutation, useGetAllStoresQuery } from '../../store/api/api';

const CreateUserForm = () => {
  const { data: stores = [], isLoading, isError } = useGetAllStoresQuery();
  const [createUser] = useCreateUserMutation();

  const {
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      username: '',
      password: '',
      role: 'STORE',
      storeId: '',
      adminScopes: [],
    },
  });

  const selectedRole = useWatch({
    control,
    name: 'role',
  });

  useEffect(() => {
    if (selectedRole !== 'STORE') {
      setValue('storeId', '');
    }
    if (selectedRole !== 'ADMIN') {
      setValue('adminScopes', []);
    }
  }, [selectedRole, setValue]);

  const storeOptions = stores.map(store => ({
    value: String(store.id),
    label: store.name || `Store #${store.id}`,
  }));

  const onSubmit = async data => {
    const payload = {
      ...data,
      storeId: data.role === 'STORE' ? Number(data.storeId) : null,
      adminScopes: data.role === 'ADMIN' ? data.adminScopes : [],
    };

    try {
      await createUser(payload).unwrap();
      reset();
      toast.success('User created!');
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Failed to create user');
    }
  };

  return (
    <Paper
      withBorder
      shadow="sm"
      radius="md"
      p="xl"
      mx="auto"
      w={{ base: '100%', sm: 450 }}
    >
      <Title
        order={3}
        mb="lg"
        ta="center"
      >
        Create New User
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap="md">
          <Controller
            name="username"
            control={control}
            rules={{ required: 'Username is required' }}
            render={({ field }) => (
              <TextInput
                {...field}
                label="Username"
                placeholder="Enter username"
                withAsterisk
                error={errors.username?.message}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            rules={{
              required: 'Password is required',
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            }}
            render={({ field }) => (
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                withAsterisk
                {...field}
                error={errors.password?.message}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label="Access Role"
                withAsterisk
                data={[
                  { value: 'ADMIN', label: 'ADMIN' },
                  { value: 'WAREHOUSE', label: 'WAREHOUSE' },
                  { value: 'STORE', label: 'STORE' },
                ]}
              />
            )}
          />

          {selectedRole === 'ADMIN' && (
            <Controller
              name="adminScopes"
              control={control}
              rules={{
                required:
                  selectedRole === 'ADMIN' ? 'Please select at least one scope' : false,
              }}
              render={({ field }) => (
                <MultiSelect
                  {...field}
                  label="Admin Scopes"
                  placeholder="-- Choose scopes --"
                  withAsterisk
                  clearable
                  searchable
                  error={errors.adminScopes?.message}
                  data={[
                    { value: 'BAGS', label: 'BAGS' },
                    { value: 'LABELS', label: 'LABELS' },
                    { value: 'PACKAGING', label: 'PACKAGING' },
                  ]}
                />
              )}
            />
          )}

          {selectedRole === 'STORE' && (
            <Controller
              name="storeId"
              control={control}
              rules={{
                required: selectedRole === 'STORE' ? 'Please select a store' : false,
              }}
              render={({ field }) => (
                <Select
                  label="Assigned Store"
                  placeholder="-- Choose a store --"
                  withAsterisk
                  data={storeOptions}
                  error={errors.storeId?.message || (isError && 'Error loading stores')}
                  disabled={isLoading}
                  rightSection={isLoading ? <Loader size="xs" /> : null}
                  onChange={val => field.onChange(val)}
                  value={field.value ? String(field.value) : null}
                />
              )}
            />
          )}

          <Button
            type="submit"
            mt="md"
            loading={isSubmitting}
            fullWidth
          >
            Create User
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateUserForm;
