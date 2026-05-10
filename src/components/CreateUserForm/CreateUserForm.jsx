import {
  Button,
  Loader,
  MultiSelect,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCreateUserMutation, useGetAllStoresQuery } from '../../store/api/api';

const CreateUserForm = () => {
  const { data: stores = [], isLoading } = useGetAllStoresQuery();
  const [createUser] = useCreateUserMutation();

  const inputStyles = {
    label: { marginBottom: 8 },
    root: { marginBottom: 5 },
  };

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

  const selectedRole = useWatch({ control, name: 'role' });

  useEffect(() => {
    if (selectedRole !== 'STORE') setValue('storeId', '');
    if (selectedRole !== 'ADMIN') setValue('adminScopes', []);
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
      p={{ base: 'md', sm: 'xl' }}
      mx="auto"
      w={{ base: '100%', sm: 500, md: 600 }}
    >
      <Title
        order={3}
        mb={30}
        ta="center"
      >
        Create New User
      </Title>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={25}>
          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="lg"
            verticalSpacing="xl"
          >
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
                  h={{ base: 42, sm: 36 }}
                  fz={{ base: 'md', sm: 'sm' }}
                  styles={inputStyles}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Password is required',
                minLength: { value: 6, message: 'At least 6 chars' },
              }}
              render={({ field }) => (
                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  withAsterisk
                  {...field}
                  error={errors.password?.message}
                  h={{ base: 42, sm: 36 }}
                  fz={{ base: 'md', sm: 'sm' }}
                  styles={inputStyles}
                />
              )}
            />
          </SimpleGrid>

          <SimpleGrid
            cols={{ base: 1, sm: 2 }}
            spacing="lg"
            verticalSpacing="xl"
          >
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
                  h={{ base: 42, sm: 36 }}
                  fz={{ base: 'md', sm: 'sm' }}
                  styles={inputStyles}
                />
              )}
            />

            {selectedRole === 'ADMIN' && (
              <Controller
                name="adminScopes"
                control={control}
                rules={{ required: selectedRole === 'ADMIN' }}
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
                      { value: 'NCG', label: 'NCG' },
                      { value: 'ADMINISTRATIVE', label: 'ADMINISTRATIVE' },
                    ]}
                    fz={{ base: 'md', sm: 'sm' }}
                    styles={inputStyles}
                  />
                )}
              />
            )}

            {selectedRole === 'STORE' && (
              <Controller
                name="storeId"
                control={control}
                rules={{ required: selectedRole === 'STORE' }}
                render={({ field }) => (
                  <Select
                    label="Assigned Store"
                    placeholder="-- Choose --"
                    withAsterisk
                    data={storeOptions}
                    error={errors.storeId?.message}
                    disabled={isLoading}
                    rightSection={isLoading ? <Loader size="xs" /> : null}
                    onChange={val => field.onChange(val)}
                    value={field.value ? String(field.value) : null}
                    h={{ base: 42, sm: 36 }}
                    fz={{ base: 'md', sm: 'sm' }}
                    styles={inputStyles}
                  />
                )}
              />
            )}
          </SimpleGrid>

          <Button
            type="submit"
            mt={20}
            loading={isSubmitting}
            fullWidth
            h={{ base: 46, sm: 40 }}
            fz={{ base: 'md', sm: 'sm' }}
          >
            Create User
          </Button>
        </Stack>
      </form>
    </Paper>
  );
};

export default CreateUserForm;
