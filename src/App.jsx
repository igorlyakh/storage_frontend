import { useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Loader from './components/Loader';
import AllOrdersPage from './pages/AllOrdersPage/AllOrdersPage';
import LoginPage from './pages/LoginPage/LoginPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderPage from './pages/OrderPage/OrderPage';
import ProductsPage from './pages/ProductsPage/ProductsPage';
import ProtectedRoutes from './pages/ProtectedRoutes';
import RestrictedRouts from './pages/RestrictedRoutes';
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
              <ProtectedRoutes allowedRoles={['ADMIN']}>
                <ProductsPage />
              </ProtectedRoutes>
            }
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
