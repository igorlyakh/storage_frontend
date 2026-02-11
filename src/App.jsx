import { Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/login"
        Component={LoginPage}
      />
    </Routes>
  );
};

export default App;
