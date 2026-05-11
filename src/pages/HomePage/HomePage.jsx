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
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { userRoleSelector } from '../../store/selectors/selectors';

const HomePage = () => {
  const userRole = useSelector(userRoleSelector);

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
            Stock Assistant
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
          Welcome to the ultimate inventory management solution. This application is
          specifically designed to ensure seamless stock control at the central warehouse
          and to provide a simplified, effortless ordering experience for retail stores.
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
                Important Information
              </Text>
            </Group>

            <Text
              ta="center"
              fw={800}
              fz="md"
              c="blue.9"
              style={{ lineHeight: 1.3 }}
            >
              Orders are accepted from Sunday to Thursday until{' '}
              <Text
                component="span"
                inherit
                c="orange.5"
              >
                14:30
              </Text>
            </Text>

            <Text
              ta="center"
              size="xs"
              c="blue.8"
              style={{ lineHeight: 1.4 }}
            >
              All orders received <b>after 14:30</b> will be processed and shipped the
              following day. Orders placed on <b>Friday and Saturday</b> will be processed
              and shipped on <b>Sunday</b>.
            </Text>
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
              Need assistance?
            </Text>
            <Text
              ta="center"
              size="xs"
              c="gray.6"
            >
              If you experience any issues, have feature requests, or need technical
              support, our dedicated team is always here to help.
            </Text>
            <Text
              ta="center"
              fw={500}
              fz="xs"
            >
              Please contact us at:{' '}
              <Text
                component="a"
                href="mailto:info@example.com"
                c="blue.6"
                inherit
                style={{ textDecoration: 'none' }}
              >
                info@example.com
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
            Go to Dashboard
          </Button>
        </Group>
      </Stack>
    </Container>
  );
};

export default HomePage;
