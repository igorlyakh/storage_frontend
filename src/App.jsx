import { lazy, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import { Center, Loader } from '@mantine/core';
import { NavigationProgress, nprogress } from '@mantine/nprogress';

import Layout from './components/layout/Layout';
import PersistLogin from './features/auth/PersistLogin';

import ProtectedRoutes from './features/auth/ProtectedRoutes';
import RestrictedRouts from './features/auth/RestrictedRoutes';
import CreateCategoryPage from './pages/CreateCategoryPage/CreateCategoryPage';

const HomePage = lazy(() => import('./pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage/LoginPage'));
const NotFoundPage = lazy(() => import('./pages/404/NotFound'));
const AllOrdersPage = lazy(() => import('./pages/AllOrdersPage/AllOrdersPage'));
const AllUsersPage = lazy(() => import('./pages/AllUsersPage'));
const CreateOrderPage = lazy(() => import('./pages/CreateOrderPage/CreateOrderPage'));
const CreateProductPage = lazy(() => import('./pages/CreateProductPage'));
const CreateStorePage = lazy(() => import('./pages/CreateStorePage'));
const CreateUserPage = lazy(() => import('./pages/CreateUserPage'));
const MyOrdersPage = lazy(() => import('./pages/MyOrdersPage'));
const OrderPage = lazy(() => import('./pages/OrderPage/OrderPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage/ProductsPage'));
const RequestPage = lazy(() => import('./pages/RequestPage/RequestPage'));
const RequestsPage = lazy(() => import('./pages/RequestsPage/RequestsPage'));
const StoresPage = lazy(() => import('./pages/StoresPage'));
const BrandsPage = lazy(() => import('./pages/BrandsPage/BrandsPage'));
const CreateBrandPage = lazy(() => import('./pages/CreateBrandPage/CreateBrandPage'));
const StatisticPage = lazy(() => import('./pages/StatisticPage/StatisticPage'));
const CategoriesPage = lazy(() => import('./pages/CategoriesPage/CategoriesPage'));

const SuspenseLoader = () => {
  useEffect(() => {
    nprogress.start();

    return () => {
      nprogress.complete();
    };
  }, []);

  return (
    <Center h="100vh">
      <Loader size={50} />
    </Center>
  );
};

const App = () => {
  const location = useLocation();

  return (
    <>
      <NavigationProgress />

      <Suspense
        key={location.pathname}
        fallback={<SuspenseLoader />}
      >
        <Routes location={location}>
          <Route element={<PersistLogin />}>
            <Route
              element={<Layout />}
              path="/"
            >
              <Route
                index
                element={<HomePage />}
              />

              <Route
                path="login"
                element={
                  <RestrictedRouts redirectTo="/">
                    <LoginPage />
                  </RestrictedRouts>
                }
              />

              <Route
                path="orders"
                element={
                  <ProtectedRoutes allowedRoles={['STORE']}>
                    <MyOrdersPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="orders/create"
                element={
                  <ProtectedRoutes allowedRoles={['STORE']}>
                    <CreateOrderPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="orders/:id"
                element={
                  <ProtectedRoutes allowedRoles={['STORE', 'ADMIN', 'WAREHOUSE']}>
                    <OrderPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="/all-orders"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN', 'WAREHOUSE']}>
                    <AllOrdersPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="products"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN', 'WAREHOUSE']}>
                    <ProductsPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="requests"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN', 'WAREHOUSE']}>
                    <RequestsPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="requests/:id"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN', 'WAREHOUSE']}>
                    <RequestPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="products/create"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CreateProductPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="users"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <AllUsersPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="users/create"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CreateUserPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="brands"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <BrandsPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="brands/create"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CreateBrandPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="categories"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CategoriesPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="categories/create"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CreateCategoryPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="stores"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <StoresPage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="stores/create"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN']}>
                    <CreateStorePage />
                  </ProtectedRoutes>
                }
              />

              <Route
                path="statistics"
                element={
                  <ProtectedRoutes allowedRoles={['ADMIN', 'WAREHOUSE']}>
                    <StatisticPage />
                  </ProtectedRoutes>
                }
              />
            </Route>

            <Route
              path="*"
              element={<NotFoundPage />}
            />
          </Route>{' '}
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
