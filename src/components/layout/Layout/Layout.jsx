import { Box } from '@mantine/core';
import { Outlet } from 'react-router-dom';
import Container from '../../ui/Container';
import Header from '../Header';

const Layout = () => {
  return (
    <Box
      bg="gray.0"
      style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}
    >
      <Header />
      <Box
        component="main"
        flex={1}
        py={{ base: 'md', sm: 'xl', md: 'xxl' }}
      >
        <Container>
          <Outlet />
        </Container>
      </Box>
    </Box>
  );
};

export default Layout;
