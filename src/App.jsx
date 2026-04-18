import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
import AllUsersPage from './pages/AllUsersPage';
import CreateOrderPage from './pages/CreateOrderPage/CreateOrderPage';
import CreateProductPage from './pages/CreateProductPage';
import CreateStorePage from './pages/CreateStorePage';
import CreateUserPage from './pages/CreateUserPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderPage from './pages/OrderPage/OrderPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProtectedRoutes from './pages/ProtectedRoutes';
import RequestPage from './pages/RequestPage/RequestPage';
import RequestsPage from './pages/RequestsPage/RequestsPage';
import RestrictedRouts from './pages/RestrictedRoutes';
import StoresPage from './pages/StoresPage';
import { isGlobalLoading } from './store/selectors/selectors';

const App = () => {
  const isLoading = useSelector(isGlobalLoading);

  return (
    <>
      {isLoading && <Loader />}
      <Routes>
        <Route
          element={<Layout />}
          path="/"
        >
          <Route
            element={<div>Home Page</div>}
            index
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
        </Route>
      </Routes>
    </>
  );
};

export default App;
