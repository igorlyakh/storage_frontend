import {
  Accordion,
  Burger,
  Button,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';
import { logOut } from '../../store/userSlice/userSlice';

const NavMenu = ({ title, items, isMobile, closeDrawer }) => {
  if (isMobile) {
    return (
      <Accordion
        variant="separated"
        styles={{ item: { border: 'none' }, control: { padding: '8px 12px' } }}
      >
        <Accordion.Item value={title}>
          <Accordion.Control>
            <Text
              size="sm"
              fw={500}
            >
              {title}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack gap={4}>
              {items.map(item => (
                <Button
                  key={item.to}
                  component={Link}
                  to={item.to}
                  variant="subtle"
                  color="dark"
                  fullWidth
                  justify="flex-start"
                  onClick={closeDrawer}
                  size="sm"
                >
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    );
  }

  return (
    <Menu
      trigger="hover"
      openDelay={50}
      closeDelay={200}
      shadow="md"
      width={200}
      withinPortal
    >
      <Menu.Target>
        <Button
          variant="subtle"
          color="gray.0"
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
          >
            {item.label}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

const Navigation = () => {
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handler = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
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
        justify={isMobile ? 'flex-start' : 'center'}
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
          justify={isMobile ? 'flex-start' : 'center'}
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
          justify={isMobile ? 'flex-start' : 'center'}
          onClick={isMobile ? close : undefined}
        >
          Requests
        </Button>
      )}

      {role === 'ADMIN' && (
        <>
          <NavMenu
            title="Users"
            items={[
              { label: 'All Users', to: '/users' },
              { label: 'Create User', to: '/users/create' },
            ]}
            isMobile={isMobile}
            closeDrawer={close}
          />
          <NavMenu
            title="Brands"
            items={[
              { label: 'All Brands', to: '/brands' },
              { label: 'Create Brand', to: '/brands/create' },
            ]}
            isMobile={isMobile}
            closeDrawer={close}
          />
          <NavMenu
            title="Categories"
            items={[
              { label: 'All Categories', to: '/categories' },
              { label: 'Create Category', to: '/categories/create' },
            ]}
            isMobile={isMobile}
            closeDrawer={close}
          />
          <NavMenu
            title="Stores"
            items={[
              { label: 'All Stores', to: '/stores' },
              { label: 'Create Store', to: '/stores/create' },
            ]}
            isMobile={isMobile}
            closeDrawer={close}
          />
        </>
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/statistics"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          justify={isMobile ? 'flex-start' : 'center'}
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
        size="xs"
        title="Stock Assistant"
        hiddenFrom="lg"
        zIndex={1000000}
      >
        <Stack gap={4}>{renderLinks(true)}</Stack>
      </Drawer>
    </>
  );
};

export default Navigation;
