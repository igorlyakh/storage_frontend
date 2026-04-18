import { Button, Center, Container, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Center
      h="100vh"
      bg="gray.0"
    >
      <Container size="md">
        <Stack
          align="center"
          gap="sm"
        >
          <Title
            style={{
              fontSize: 'clamp(100px, 20vw, 220px)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--mantine-color-gray-3)',
              marginBottom: '-30px',
              userSelect: 'none',
            }}
          >
            404
          </Title>

          <Title
            order={2}
            ta="center"
            mt="xl"
            style={{ zIndex: 1 }}
          >
            Oops! Page not found
          </Title>

          <Text
            c="dimmed"
            size="lg"
            ta="center"
            maw={540}
            style={{ zIndex: 1 }}
          >
            The page you are looking for might have been removed, had its name changed, or
            is temporarily unavailable.
          </Text>

          <Group
            justify="center"
            mt="xl"
            style={{ zIndex: 1 }}
          >
            <Button
              component={Link}
              to="/"
              size="md"
              radius="md"
              variant="filled"
              color="blue"
            >
              Back to Home
            </Button>
          </Group>
        </Stack>
      </Container>
    </Center>
  );
};

export default NotFoundPage;
