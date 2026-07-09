import { Button, Modal, PasswordInput, Stack } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useResetUserPasswordMutation } from '../../../store/api/api';

const ResetPasswordModal = ({ opened, onClose, user }) => {
  const { t } = useTranslation('users');
  const [resetPassword, { isLoading }] = useResetUserPasswordMutation();
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return toast.error(t('resetPassword.tooShort'));
    }
    try {
      await resetPassword({ id: user.id, password: newPassword }).unwrap();
      toast.success(t('resetPassword.updated'));
      setNewPassword('');
      onClose();
    } catch {
      toast.error(t('resetPassword.updateFailed'));
    }
  };

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={t('resetPassword.title', { username: user.username })}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <PasswordInput
          label={t('resetPassword.newPasswordLabel')}
          placeholder={t('resetPassword.newPasswordPlaceholder')}
          value={newPassword}
          onChange={e => setNewPassword(e.currentTarget.value)}
          size={{ base: 'md', sm: 'sm' }}
        />
        <Button
          onClick={handleResetPassword}
          loading={isLoading}
          fullWidth
          size="md"
        >
          {t('resetPassword.confirmButton')}
        </Button>
      </Stack>
    </Modal>
  );
};

export default ResetPasswordModal;
