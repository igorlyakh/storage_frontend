import { Box } from '@mantine/core';
import { useSelector } from 'react-redux';
import { Outlet, useLocation } from 'react-router-dom';
import { useGetSettingsQuery } from '../../../store/api/api';
import { userRoleSelector } from '../../../store/selectors/selectors';
import Container from '../../ui/Container';
import MaintenanceStub from '../../MaintenanceStub';
import Header from '../Header';

const Layout = () => {
  const { data: settings } = useGetSettingsQuery();
  const userRole = useSelector(userRoleSelector);
  const location = useLocation();

  const showMaintenanceStub =
    settings?.maintenanceMode && userRole !== 'ADMIN' && location.pathname !== '/login';

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
        <Container>{showMaintenanceStub ? <MaintenanceStub settings={settings} /> : <Outlet />}</Container>
      </Box>
    </Box>
  );
};

export default Layout;
