import { Button, Group, Menu } from '@mantine/core';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../store/selectors/selectors';
import { logoutAction } from '../../store/userSlice/userSlice';

const NavMenu = ({ title, items }) => (
  <Menu
    trigger="hover"
    openDelay={100}
    closeDelay={200}
    shadow="md"
    width={200}
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

const Navigation = () => {
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();

  const handler = async () => {
    try {
      await logout().unwrap();
      dispatch(logoutAction());
      toast.success('You have successfully logged out!');
    } catch {
      toast.error('Something went wrong! Try again.');
    }
  };

  return (
    <Group
      component="nav"
      gap="sm"
    >
      <Button
        component={Link}
        to="/"
        variant="subtle"
        color="gray.0"
      >
        Home
      </Button>

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/all-orders"
          variant="subtle"
          color="gray.0"
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
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <NavMenu
          title="Products"
          items={[
            { label: 'All Products', to: '/products' },
            { label: 'Create Product', to: '/products/create' },
          ]}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/requests"
          variant="subtle"
          color="gray.0"
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
        />
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title="Brands"
          items={[
            { label: 'All Brands', to: '/brands' },
            { label: 'Create Brand', to: '/brands/create' },
          ]}
        />
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title="Stores"
          items={[
            { label: 'All Stores', to: '/stores' },
            { label: 'Create Store', to: '/stores/create' },
          ]}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/statistics"
          variant="subtle"
          color="gray.0"
        >
          Statistics
        </Button>
      )}

      {token ? (
        <Button
          variant="light"
          color="red"
          onClick={handler}
          ml="md"
        >
          Logout
        </Button>
      ) : (
        <Button
          component={Link}
          to="/login"
          variant="filled"
          color="blue"
          ml="md"
        >
          Login
        </Button>
      )}
    </Group>
  );
};

export default Navigation;
