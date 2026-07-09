import { Box, Group, Title } from '@mantine/core';
import { Link } from 'react-router-dom';
import LanguageSwitcher from '../../../features/language/LanguageSwitcher';
import Navigation from '../Navigation';

const Header = () => {
  return (
    <Box
      component="header"
      px="xl"
      py="sm"
      bg="dark.9"
      c="white"
      style={{
        borderBottom: '1px solid var(--mantine-color-dark-5)',
        boxShadow: '0 2px 12px rgba(0, 0, 0, 0.15)',
      }}
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
          Stock Assistant
        </Title>

        <Group
          gap="sm"
          align="center"
        >
          <LanguageSwitcher />
          <Navigation />
        </Group>
      </Group>
    </Box>
  );
};

export default Header;
