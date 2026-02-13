import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route
        element={<Layout />}
        path="/"
      >
        <Route
          path="login"
          element={<LoginPage />}
        />
      </Route>
    </Routes>
  );
};

export default App;
