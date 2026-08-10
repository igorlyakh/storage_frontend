import { Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '../../../store/api/api';
import { getApiErrorMessage } from '../../../utils/apiError';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SupplierFormModal = ({ opened, onClose, supplier }) => {
  const { t } = useTranslation('suppliers');
  const [createSupplier, { isLoading: isCreating }] = useCreateSupplierMutation();
  const [updateSupplier, { isLoading: isUpdating }] = useUpdateSupplierMutation();

  const isEdit = !!supplier;
  const isLoading = isCreating || isUpdating;

  const [name, setName] = useState(supplier?.name || '');
  const [contactPerson, setContactPerson] = useState(supplier?.contactPerson || '');
  const [email, setEmail] = useState(supplier?.email || '');
  const [notes, setNotes] = useState(supplier?.notes || '');
  const [errors, setErrors] = useState({});

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  const handleSubmit = async () => {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = t('form.nameRequired');
    }
    if (email.trim() && !EMAIL_PATTERN.test(email.trim())) {
      nextErrors.email = t('form.emailInvalid');
    }
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      name: name.trim(),
      contactPerson: contactPerson.trim() || null,
      email: email.trim() || null,
      notes: notes.trim() || null,
    };

    try {
      if (isEdit) {
        await updateSupplier({ id: supplier.id, ...payload }).unwrap();
        toast.success(t('form.updated'));
      } else {
        await createSupplier(payload).unwrap();
        toast.success(t('form.created'));
        setName('');
        setContactPerson('');
        setEmail('');
        setNotes('');
      }
      handleClose();
    } catch (error) {
      toast.error(
        getApiErrorMessage(t, error, isEdit ? 'form.updateFailed' : 'form.createFailed'),
      );
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={isEdit ? t('form.editTitle') : t('form.createTitle')}
      centered
      size={{ base: '95%', sm: 480 }}
      padding={{ base: 'md', sm: 'lg' }}
    >
      <Stack gap={{ base: 'sm', sm: 'md' }}>
        <TextInput
          label={t('form.nameLabel')}
          placeholder={t('form.namePlaceholder')}
          withAsterisk
          value={name}
          onChange={event => setName(event.currentTarget.value)}
          error={errors.name}
          data-autofocus
        />
        <TextInput
          label={t('form.contactPersonLabel')}
          placeholder={t('form.contactPersonPlaceholder')}
          value={contactPerson}
          onChange={event => setContactPerson(event.currentTarget.value)}
        />
        <TextInput
          type="email"
          label={t('form.emailLabel')}
          placeholder={t('form.emailPlaceholder')}
          value={email}
          onChange={event => setEmail(event.currentTarget.value)}
          error={errors.email}
        />
        <Textarea
          label={t('form.notesLabel')}
          placeholder={t('form.notesPlaceholder')}
          autosize
          minRows={2}
          maxRows={5}
          value={notes}
          onChange={event => setNotes(event.currentTarget.value)}
        />

        <Group justify="flex-end">
          <Button
            variant="light"
            color="gray"
            onClick={handleClose}
            disabled={isLoading}
          >
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            loading={isLoading}
          >
            {isEdit ? t('form.saveChanges') : t('form.submit')}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};

export default SupplierFormModal;
