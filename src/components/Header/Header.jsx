import { Box, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import Navigation from '../Navigation';

const Header = () => {
  return (
    <Box
      component="header"
      px="xl"
      py="sm"
      bg="dark.9"
      c="white"
      style={{ borderBottom: '1px solid var(--mantine-color-dark-4)' }}
    >
      <Group
        justify="space-between"
        align="center"
      >
        <Title
          order={3}
          component={Link}
          to="/"
          c="blue.4"
          style={{ textDecoration: 'none' }}
        >
          Stock Control
        </Title>

        <Navigation />
      </Group>
    </Box>
  );
};

export default Header;
