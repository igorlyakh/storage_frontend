import { Button, Container, Group, Paper, Stack, Text, Title } from '@mantine/core';
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

        <Text
          c="dimmed"
          size="md"
          ta="center"
          maw={700}
          visibleFrom="sm"
        >
          Streamline your entire supply chain, track product availability in real-time,
          and manage automated replenishment requests with absolute precision. Built for
          speed, accuracy, and uninterrupted collaboration across your entire retail
          network.
        </Text>

        <Paper
          withBorder
          p={{ base: 'md', sm: 'lg' }}
          radius="md"
          shadow="sm"
          bg="gray.0"
          mt="xl"
          w="100%"
          maw={500}
        >
          <Stack
            gap="xs"
            align="center"
          >
            <Text
              fw={600}
              size="lg"
              c="dark.8"
            >
              Need assistance?
            </Text>
            <Text
              ta="center"
              size="sm"
              c="gray.6"
            >
              If you experience any issues, have feature requests, or need technical
              support, our dedicated team is always here to help.
            </Text>
            <Text
              ta="center"
              fw={500}
              mt="sm"
              fz="sm"
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
          mt="xl"
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
