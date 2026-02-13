import { Outlet } from 'react-router-dom';
import Container from '../Container';
import Header from '../Header';

const Layout = () => {
  return (
    <>
      <Header />
      <Container>
        <Outlet />
      </Container>
    </>
  );
};

export default Layout;
