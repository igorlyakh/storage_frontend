import { Button, Center, Container, Group, Stack, Text, Title } from '@mantine/core';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Center
      minHeight="100vh"
      bg="gray.0"
      p={{ base: 'md', sm: 'xl' }}
    >
      <Container
        size="md"
        w="100%"
      >
        <Stack
          align="center"
          gap={{ base: 'md', sm: 'sm' }}
        >
          <Title
            style={{
              fontSize: 'clamp(100px, 20vw, 220px)',
              fontWeight: 900,
              lineHeight: 1,
              color: 'var(--mantine-color-gray-3)',
              marginBottom: 'clamp(-15px, -3vw, -30px)',
              userSelect: 'none',
            }}
          >
            404
          </Title>

          <Title
            order={2}
            ta="center"
            mt={{ base: 'sm', sm: 'xl' }}
            fz={{ base: 24, sm: 34 }}
            style={{ zIndex: 1 }}
          >
            Oops! Page not found
          </Title>

          <Text
            c="dimmed"
            size={{ base: 'sm', sm: 'lg' }}
            ta="center"
            maw={540}
            style={{ zIndex: 1 }}
          >
            The page you are looking for might have been removed, had its name changed, or
            is temporarily unavailable.
          </Text>

          <Group
            justify="center"
            mt={{ base: 'lg', sm: 'xl' }}
            w="100%"
            style={{ zIndex: 1 }}
          >
            <Button
              component={Link}
              to="/"
              size="md"
              radius="md"
              variant="filled"
              color="blue"
              w={{ base: '100%', sm: 'auto' }}
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
