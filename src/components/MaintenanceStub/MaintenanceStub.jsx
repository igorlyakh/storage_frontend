import { Center, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';
import { Wrench } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MaintenanceStub = ({ settings }) => {
  const { t } = useTranslation('settings');

  const message = settings?.maintenanceMessage?.trim() || t('maintenance.defaultMessage');
  const email = settings?.maintenanceEmail;

  return (
    <Center
      mih="60vh"
      p={{ base: 'md', sm: 'xl' }}
    >
      <Paper
        withBorder
        p={{ base: 'lg', sm: 'xl' }}
        radius="lg"
        shadow="sm"
        maw={560}
        w="100%"
      >
        <Stack
          align="center"
          gap="md"
        >
          <ThemeIcon
            variant="light"
            color="orange"
            size={72}
            radius="xl"
          >
            <Wrench size={36} />
          </ThemeIcon>

          <Title
            order={2}
            ta="center"
          >
            {t('maintenance.title')}
          </Title>

          <Text
            ta="center"
            c="dimmed"
            style={{ whiteSpace: 'pre-wrap' }}
          >
            {message}
          </Text>

          {email && (
            <Text
              ta="center"
              fw={600}
            >
              {t('maintenance.sendOrdersTo')}{' '}
              <Text
                component="a"
                href={`mailto:${email}`}
                c="blue.6"
                inherit
                style={{ textDecoration: 'none' }}
              >
                {email}
              </Text>
            </Text>
          )}
        </Stack>
      </Paper>
    </Center>
  );
};

export default MaintenanceStub;
