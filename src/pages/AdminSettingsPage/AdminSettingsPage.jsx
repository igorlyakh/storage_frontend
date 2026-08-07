import {
  Alert,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { CalendarClock, Save, TriangleAlert, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useGetSettingsQuery, useUpdateSettingsMutation } from '../../store/api/api';
import { getApiErrorMessage } from '../../utils/apiError';

const AdminSettingsPage = () => {
  const { t } = useTranslation('settings');
  const { data: settings, isLoading } = useGetSettingsQuery();
  const [updateSettings, { isLoading: isSaving }] = useUpdateSettingsMutation();

  const [form, setForm] = useState(null);

  useEffect(() => {
    if (settings) {
      setForm({
        orderDayFrom: String(settings.orderDayFrom),
        orderDayTo: String(settings.orderDayTo),
        orderCutoffTime: settings.orderCutoffTime,
        supportEmail: settings.supportEmail,
        maintenanceMode: settings.maintenanceMode,
        maintenanceMessage: settings.maintenanceMessage || '',
        maintenanceEmail: settings.maintenanceEmail,
      });
    }
  }, [settings]);

  const dayOptions = Array.from({ length: 7 }, (_, day) => ({
    value: String(day),
    label: t(`common:days.${day}`),
  }));

  const setField = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      await updateSettings({
        orderDayFrom: Number(form.orderDayFrom),
        orderDayTo: Number(form.orderDayTo),
        orderCutoffTime: form.orderCutoffTime,
        supportEmail: form.supportEmail.trim(),
        maintenanceMode: form.maintenanceMode,
        maintenanceMessage: form.maintenanceMessage,
        maintenanceEmail: form.maintenanceEmail.trim(),
      }).unwrap();
      toast.success(t('saved'));
    } catch (error) {
      toast.error(getApiErrorMessage(t, error, 'saveFailed'));
    }
  };

  if (isLoading || !form) {
    return (
      <Center h={300}>
        <Loader
          size="xl"
          color="blue"
        />
      </Center>
    );
  }

  return (
    <Container
      size="sm"
      py="xl"
    >
      <Stack gap="lg">
        <Title order={2}>{t('pageTitle')}</Title>

        <Paper
          withBorder
          p="lg"
          radius="md"
          shadow="xs"
        >
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon
                variant="light"
                color="blue"
                size="lg"
                radius="md"
              >
                <CalendarClock size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700}>{t('homeCard.title')}</Text>
                <Text
                  size="xs"
                  c="dimmed"
                >
                  {t('homeCard.description')}
                </Text>
              </div>
            </Group>

            <Group
              grow
              align="flex-start"
            >
              <Select
                label={t('homeCard.dayFrom')}
                data={dayOptions}
                value={form.orderDayFrom}
                onChange={value => setField('orderDayFrom', value)}
                allowDeselect={false}
              />
              <Select
                label={t('homeCard.dayTo')}
                data={dayOptions}
                value={form.orderDayTo}
                onChange={value => setField('orderDayTo', value)}
                allowDeselect={false}
              />
            </Group>

            <Group
              grow
              align="flex-start"
            >
              <TimeInput
                label={t('homeCard.cutoffTime')}
                value={form.orderCutoffTime}
                onChange={event => setField('orderCutoffTime', event.currentTarget.value)}
              />
              <TextInput
                label={t('homeCard.supportEmail')}
                type="email"
                value={form.supportEmail}
                onChange={event => setField('supportEmail', event.currentTarget.value)}
              />
            </Group>
          </Stack>
        </Paper>

        <Paper
          withBorder
          p="lg"
          radius="md"
          shadow="xs"
        >
          <Stack gap="md">
            <Group gap="sm">
              <ThemeIcon
                variant="light"
                color="orange"
                size="lg"
                radius="md"
              >
                <Wrench size={20} />
              </ThemeIcon>
              <div>
                <Text fw={700}>{t('maintenanceCard.title')}</Text>
                <Text
                  size="xs"
                  c="dimmed"
                >
                  {t('maintenanceCard.description')}
                </Text>
              </div>
            </Group>

            <Switch
              label={t('maintenanceCard.enable')}
              color="orange"
              size="md"
              checked={form.maintenanceMode}
              onChange={event => setField('maintenanceMode', event.currentTarget.checked)}
            />

            {form.maintenanceMode && (
              <Alert
                color="orange"
                icon={<TriangleAlert size={18} />}
                radius="md"
              >
                {t('maintenanceCard.enabledWarning')}
              </Alert>
            )}

            <TextInput
              label={t('maintenanceCard.email')}
              type="email"
              value={form.maintenanceEmail}
              onChange={event => setField('maintenanceEmail', event.currentTarget.value)}
            />

            <Textarea
              label={t('maintenanceCard.message')}
              placeholder={t('maintenanceCard.messagePlaceholder')}
              autosize
              minRows={3}
              maxLength={1000}
              value={form.maintenanceMessage}
              onChange={event => setField('maintenanceMessage', event.currentTarget.value)}
            />

            <Text
              size="xs"
              c="dimmed"
            >
              {t('maintenanceCard.defaultMessageLabel')} {t('maintenance.defaultMessage')}
            </Text>
          </Stack>
        </Paper>

        <Group justify="flex-end">
          <Button
            leftSection={<Save size={16} />}
            loading={isSaving}
            onClick={handleSave}
          >
            {t('save')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default AdminSettingsPage;
