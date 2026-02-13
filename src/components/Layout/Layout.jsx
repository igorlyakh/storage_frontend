import { Outlet } from 'react-router-dom';
import Container from '../Container';

const Layout = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

export default Layout;
