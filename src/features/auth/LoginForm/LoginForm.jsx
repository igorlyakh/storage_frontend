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
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { syncLanguageFromAccount } from '../../language/useSyncLanguage';
import { useLoginMutation } from '../../../store/api/api';
import { setData } from '../../../store/userSlice/userSlice';
import { getApiErrorMessage } from '../../../utils/apiError';

const LoginForm = () => {
  const { t, i18n } = useTranslation('auth');
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
      syncLanguageFromAccount(i18n, data.language);
      toast.success(t('welcomeToast', { username: data.username }));
      reset();
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'loginFailed'));
    }
  };

  return (
    <Center
      h="100%"
      mt={{ base: 60, sm: 100, md: 150 }}
      px={{ base: 'md', sm: 0 }}
    >
      <Paper
        withBorder
        shadow="md"
        p={{ base: 'lg', sm: 30 }}
        radius="md"
        w={{ base: '100%', sm: 400 }}
      >
        <Title
          order={2}
          ta="center"
          mb="lg"
          fz={{ base: 22, sm: 26 }}
        >
          {t('welcomeTitle')}
        </Title>

        <form onSubmit={handleSubmit(handler)}>
          <Stack gap={{ base: 'sm', sm: 'md' }}>
            <TextInput
              label={t('username')}
              placeholder={t('usernamePlaceholder')}
              withAsterisk
              {...register('username', {
                required: t('usernameRequired'),
              })}
              error={errors.username?.message}
              size={{ base: 'md', sm: 'sm' }}
            />

            <PasswordInput
              label={t('password')}
              placeholder={t('passwordPlaceholder')}
              withAsterisk
              {...register('password', {
                required: t('passwordRequired'),
                minLength: {
                  value: 6,
                  message: t('passwordMinLength'),
                },
              })}
              error={errors.password?.message}
              size={{ base: 'md', sm: 'sm' }}
            />

            <Button
              type="submit"
              fullWidth
              mt={{ base: 'sm', sm: 'md' }}
              loading={isLoading}
              size="md"
            >
              {t('login')}
            </Button>
          </Stack>
        </form>
      </Paper>
    </Center>
  );
};

export default LoginForm;
