import { Burger, Button, Drawer, Group, Menu, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';
import { logoutAction } from '../../store/userSlice/userSlice';

const NavMenu = ({ title, items, isMobile, closeDrawer }) => (
  <Menu
    trigger={isMobile ? 'click' : 'hover'}
    openDelay={100}
    closeDelay={200}
    shadow="md"
    width={isMobile ? '100%' : 200}
  >
    <Menu.Target>
      <Button
        variant="subtle"
        color={isMobile ? 'dark' : 'gray.0'}
        fullWidth={isMobile}
      >
        {title}
      </Button>
    </Menu.Target>
    <Menu.Dropdown>
      {items.map(item => (
        <Menu.Item
          key={item.to}
          component={Link}
          to={item.to}
          onClick={isMobile ? closeDrawer : undefined}
        >
          {item.label}
        </Menu.Item>
      ))}
    </Menu.Dropdown>
  </Menu>
);

const Navigation = () => {
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handler = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('You have successfully logged out!');
      close();
    } catch {
      toast.error('Something went wrong! Try again.');
    }
  };

  const renderLinks = isMobile => (
    <>
      <Button
        component={Link}
        to="/"
        variant="subtle"
        color={isMobile ? 'dark' : 'gray.0'}
        fullWidth={isMobile}
        onClick={isMobile ? close : undefined}
      >
        Home
      </Button>

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/all-orders"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          onClick={isMobile ? close : undefined}
        >
          All orders
        </Button>
      )}

      {role === 'STORE' && (
        <NavMenu
          title="Order"
          items={[
            { label: 'My Orders', to: '/orders' },
            { label: 'Create Order', to: '/orders/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <NavMenu
          title="Products"
          items={[
            { label: 'All Products', to: '/products' },
            { label: 'Create Product', to: '/products/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/requests"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          onClick={isMobile ? close : undefined}
        >
          Requests
        </Button>
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title="Users"
          items={[
            { label: 'All Users', to: '/users' },
            { label: 'Create User', to: '/users/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title="Brands"
          items={[
            { label: 'All Brands', to: '/brands' },
            { label: 'Create Brand', to: '/brands/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title="Stores"
          items={[
            { label: 'All Stores', to: '/stores' },
            { label: 'Create Store', to: '/stores/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/statistics"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          onClick={isMobile ? close : undefined}
        >
          Statistics
        </Button>
      )}

      {token ? (
        <Button
          variant="light"
          color="red"
          onClick={handler}
          fullWidth={isMobile}
          ml={isMobile ? 0 : 'md'}
          mt={isMobile ? 'md' : 0}
        >
          Logout
        </Button>
      ) : (
        <Button
          component={Link}
          to="/login"
          variant="filled"
          color="blue"
          onClick={isMobile ? close : undefined}
          fullWidth={isMobile}
          ml={isMobile ? 0 : 'md'}
          mt={isMobile ? 'md' : 0}
        >
          Login
        </Button>
      )}
    </>
  );

  return (
    <>
      <Burger
        opened={opened}
        onClick={toggle}
        hiddenFrom="lg"
        color="gray.0"
        size="sm"
      />

      <Group
        component="nav"
        gap="sm"
        visibleFrom="lg"
      >
        {renderLinks(false)}
      </Group>

      <Drawer
        opened={opened}
        onClose={close}
        size="sm"
        title="Navigation"
        hiddenFrom="lg"
        zIndex={1000000}
      >
        <Stack gap="xs">{renderLinks(true)}</Stack>
      </Drawer>
    </>
  );
};

export default Navigation;
