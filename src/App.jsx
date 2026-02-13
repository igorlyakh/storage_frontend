import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage/LoginPage';
import RestrictedRouts from './pages/RestrictedRoutes';

const App = () => {
  return (
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
      </Route>
    </Routes>
  );
};

export default App;
