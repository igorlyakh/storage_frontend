import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { Info } from 'lucide-react';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useGetSettingsQuery } from '../../store/api/api';
import { userRoleSelector } from '../../store/selectors/selectors';

const DEFAULTS = {
  orderDayFrom: 0,
  orderDayTo: 4,
  orderCutoffTime: '14:30',
  supportEmail: 'info@example.com',
};

const getOffDays = (from, to) => {
  const offDays = [];
  for (let shift = 1; shift <= 6; shift += 1) {
    const day = (to + shift) % 7;
    if (day === from) break;
    offDays.push(day);
  }
  return offDays;
};

const HomePage = () => {
  const { t } = useTranslation('common');
  const userRole = useSelector(userRoleSelector);
  const { data } = useGetSettingsQuery();

  const settings = data || DEFAULTS;
  const dayName = day => t(`days.${day}`);
  const offDays = getOffDays(settings.orderDayFrom, settings.orderDayTo);

  return (
    <Container
      size="md"
      py={{ base: 40, sm: 80 }}
    >
      <Stack
        align="center"
        gap={{ base: 'md', sm: 'lg' }}
      >
        <Title
          order={1}
          ta="center"
          style={{
            fontSize: 'clamp(2.5rem, 8vw, 4rem)',
            fontWeight: 900,
            letterSpacing: '-2px',
          }}
        >
          <Text
            component="span"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan', deg: 45 }}
            inherit
            tt="uppercase"
          >
            {t('home.title')}
          </Text>
        </Title>

        <Text
          c="dimmed"
          size="xl"
          ta="center"
          maw={800}
          mt="md"
          fz={{ base: 'md', sm: 'xl' }}
        >
          {t('home.intro')}
        </Text>

        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="xs"
          bg="blue.0"
          style={{ borderColor: 'var(--mantine-color-blue-4)' }}
          w="100%"
          maw={500}
        >
          <Stack
            gap="xs"
            align="center"
          >
            <Group gap="xs">
              <ThemeIcon
                variant="light"
                color="blue"
                size="sm"
                radius="xl"
              >
                <Info size={14} />
              </ThemeIcon>
              <Text
                fw={700}
                c="blue.9"
                fz="xs"
                tt="uppercase"
              >
                {t('home.importantInfo')}
              </Text>
            </Group>

            <Text
              ta="center"
              fw={800}
              fz="md"
              c="blue.9"
              style={{ lineHeight: 1.3 }}
            >
              {t('home.cutoffLine', {
                fromDay: dayName(settings.orderDayFrom),
                toDay: dayName(settings.orderDayTo),
              })}{' '}
              <Text
                component="span"
                inherit
                c="orange.5"
              >
                {settings.orderCutoffTime}
              </Text>
            </Text>

            <Text
              ta="center"
              size="xs"
              c="blue.8"
              style={{ lineHeight: 1.4 }}
            >
              <Trans
                t={t}
                i18nKey="home.cutoffAfter"
                values={{ time: settings.orderCutoffTime }}
                components={{ b1: <b /> }}
              />
            </Text>
            {offDays.length > 0 && (
              <Text
                ta="center"
                size="xs"
                c="blue.8"
                style={{ lineHeight: 1.4 }}
              >
                <Trans
                  t={t}
                  i18nKey="home.cutoffOffDays"
                  values={{
                    offDays: offDays.map(dayName).join(', '),
                    nextDay: dayName(settings.orderDayFrom),
                  }}
                  components={{ b2: <b />, b3: <b /> }}
                />
              </Text>
            )}
          </Stack>
        </Paper>

        <Paper
          withBorder
          p="md"
          radius="md"
          shadow="sm"
          bg="gray.0"
          w="100%"
          maw={500}
        >
          <Stack
            gap="xs"
            align="center"
          >
            <Text
              fw={600}
              size="md"
              c="dark.8"
            >
              {t('home.needHelp')}
            </Text>
            <Text
              ta="center"
              size="xs"
              c="gray.6"
            >
              {t('home.helpDetails')}
            </Text>
            <Text
              ta="center"
              fw={500}
              fz="xs"
            >
              {t('home.contactUs')}{' '}
              <Text
                component="a"
                href={`mailto:${settings.supportEmail}`}
                c="blue.6"
                inherit
                style={{ textDecoration: 'none' }}
              >
                {settings.supportEmail}
              </Text>
            </Text>
          </Stack>
        </Paper>

        <Group
          mt="lg"
          w={{ base: '100%', sm: 'auto' }}
        >
          <Button
            component={Link}
            to={userRole === 'STORE' ? '/orders' : '/all-orders'}
            size="lg"
            radius="md"
            color="blue"
            fullWidth={{ base: true, sm: false }}
          >
            {t('home.goToDashboard')}
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default HomePage;
