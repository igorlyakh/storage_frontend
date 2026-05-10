import { Button, Modal, PasswordInput, Stack } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useResetUserPasswordMutation } from '../../store/api/api';

const ResetPasswordModal = ({ opened, onClose, user }) => {
  const [resetPassword, { isLoading }] = useResetUserPasswordMutation();
  const [newPassword, setNewPassword] = useState('');

  const handleResetPassword = async () => {
    if (newPassword.length < 6) {
      return toast.error('Password too short');
    }
    try {
      await resetPassword({ id: user.id, password: newPassword }).unwrap();
      toast.success('Password updated!');
      setNewPassword('');
      onClose();
    } catch {
      toast.error('Failed to update password');
    }
  };

  if (!user) return null;

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={`Reset password for ${user.username}`}
      centered
      size={400}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <PasswordInput
          label="New Password"
          placeholder="Enter new password"
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
          Confirm New Password
        </Button>
      </Stack>
    </Modal>
  );
};

export default ResetPasswordModal;
