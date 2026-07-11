import {
  ActionIcon,
  Accordion,
  Burger,
  Button,
  Drawer,
  Group,
  Menu,
  Stack,
  Text,
  Tooltip,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { PackageSearch } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { useLogoutMutation } from '../../../store/api/api';
import { tokenSelector, userRoleSelector } from '../../../store/selectors/selectors';
import { logOut, triggerLowStockCheck } from '../../../store/userSlice/userSlice';

const NavMenu = ({ title, items, sections, isMobile, closeDrawer }) => {
  const groupedSections = sections || [{ label: null, items }];

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
            <Stack gap="sm">
              {groupedSections.map(section => (
                <Stack
                  key={section.label || 'default'}
                  gap={4}
                >
                  {section.label && (
                    <Text
                      size="xs"
                      fw={700}
                      c="dimmed"
                      tt="uppercase"
                      px={12}
                    >
                      {section.label}
                    </Text>
                  )}
                  {section.items.map(item => (
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
        {groupedSections.map((section, index) => (
          <div key={section.label || 'default'}>
            {section.label && <Menu.Label>{section.label}</Menu.Label>}
            {section.items.map(item => (
              <Menu.Item
                key={item.to}
                component={Link}
                to={item.to}
              >
                {item.label}
              </Menu.Item>
            ))}
            {index < groupedSections.length - 1 && <Menu.Divider />}
          </div>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
};

const Navigation = () => {
  const { t } = useTranslation('nav');
  const token = useSelector(tokenSelector);
  const role = useSelector(userRoleSelector);
  const dispatch = useDispatch();
  const [logout] = useLogoutMutation();
  const [opened, { toggle, close }] = useDisclosure(false);

  const handler = async () => {
    try {
      await logout().unwrap();
      dispatch(logOut());
      toast.success(t('logoutSuccess'));
      close();
    } catch {
      toast.error(t('common:feedback.somethingWentWrong'));
    }
  };

  const handleLowStockCheck = () => {
    dispatch(triggerLowStockCheck());
    close();
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
        {t('home')}
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
          {t('allOrders')}
        </Button>
      )}

      {role === 'STORE' && (
        <NavMenu
          title={t('order.title')}
          items={[
            { label: t('order.myOrders'), to: '/orders' },
            { label: t('order.createOrder'), to: '/orders/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title={t('productsMenu.title')}
          items={[
            { label: t('productsMenu.allProducts'), to: '/products' },
            { label: t('productsMenu.createProduct'), to: '/products/create' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {role === 'WAREHOUSE' && (
        <Button
          component={Link}
          to="/products"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          justify={isMobile ? 'flex-start' : 'center'}
          onClick={isMobile ? close : undefined}
        >
          {t('productsMenu.allProducts')}
        </Button>
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
          {t('requests')}
        </Button>
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <Button
          component={Link}
          to="/write-off/create"
          variant="subtle"
          color={isMobile ? 'dark' : 'gray.0'}
          fullWidth={isMobile}
          justify={isMobile ? 'flex-start' : 'center'}
          onClick={isMobile ? close : undefined}
        >
          {t('writeOff')}
        </Button>
      )}

      {role === 'ADMIN' && (
        <NavMenu
          title={t('management.title')}
          sections={[
            {
              label: t('management.users'),
              items: [
                { label: t('management.allUsers'), to: '/users' },
                { label: t('management.createUser'), to: '/users/create' },
              ],
            },
            {
              label: t('management.brands'),
              items: [
                { label: t('management.allBrands'), to: '/brands' },
                { label: t('management.createBrand'), to: '/brands/create' },
              ],
            },
            {
              label: t('management.categories'),
              items: [
                { label: t('management.allCategories'), to: '/categories' },
                { label: t('management.createCategory'), to: '/categories/create' },
              ],
            },
            {
              label: t('management.stores'),
              items: [
                { label: t('management.allStores'), to: '/stores' },
                { label: t('management.createStore'), to: '/stores/create' },
              ],
            },
            {
              label: t('management.warehouses'),
              items: [{ label: t('management.allWarehouses'), to: '/warehouses' }],
            },
            {
              label: t('management.products'),
              items: [{ label: t('management.reorderProducts'), to: '/ordering' }],
            },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {['ADMIN', 'WAREHOUSE'].includes(role) && (
        <NavMenu
          title={t('statistics.title')}
          items={[
            { label: t('statistics.orders'), to: '/statistics' },
            { label: t('statistics.requests'), to: '/statistics/requests' },
          ]}
          isMobile={isMobile}
          closeDrawer={close}
        />
      )}

      {role === 'ADMIN' &&
        (isMobile ? (
          <Button
            variant="subtle"
            color="dark"
            leftSection={<PackageSearch size={16} />}
            onClick={handleLowStockCheck}
            fullWidth
            justify="flex-start"
          >
            {t('checkLowStock')}
          </Button>
        ) : (
          <Tooltip label={t('checkLowStockTooltip')}>
            <ActionIcon
              variant="subtle"
              color="gray.0"
              size="lg"
              onClick={handleLowStockCheck}
            >
              <PackageSearch size={18} />
            </ActionIcon>
          </Tooltip>
        ))}

      {token ? (
        <Button
          variant="light"
          color="red"
          onClick={handler}
          fullWidth={isMobile}
          ml={isMobile ? 0 : 'md'}
          mt={isMobile ? 'md' : 0}
        >
          {t('logout')}
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
          {t('login')}
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
