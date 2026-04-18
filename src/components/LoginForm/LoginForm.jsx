import {
  Button,
  Center,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/api/api';
import { setData } from '../../store/userSlice/userSlice';

const LoginForm = () => {
  const [login, { isLoading }] = useLoginMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();

  const handler = async formData => {
    try {
      const data = await login(formData).unwrap();
      dispatch(setData(data));
      toast.success(`Welcome, ${data.username}!`);
      reset();
    } catch (error) {
      toast.error(error.data?.message || error.message || 'Login failed');
    }
  };

  return (
    <Center
      h="100%"
      style={{ marginTop: 150 }}
    >
      <Paper
        withBorder
        shadow="md"
        p={30}
        radius="md"
        w={{ base: 300, sm: 400 }}
      >
        <Title
          order={2}
          ta="center"
          mb="lg"
        >
          Welcome to Stock Control
        </Title>

        <form onSubmit={handleSubmit(handler)}>
          <Stack>
            <TextInput
              label="Username"
              placeholder="Enter your username"
              withAsterisk
              {...register('username', {
                required: 'Username is required!',
              })}
              error={errors.username?.message}
            />

            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              withAsterisk
              {...register('password', {
                required: 'Password is required!',
                minLength: {
                  value: 6,
                  message: 'Password must be longer than 6 characters!',
                },
              })}
              error={errors.password?.message}
            />

            <Button
              type="submit"
              fullWidth
              mt="md"
              loading={isLoading}
            >
              Login
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default LoginForm;
