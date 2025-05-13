import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import WelcomePage from './pages/WelcomePage';

function App() {
  return (
     <div>
      <Routes>
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="auth/register" element={<AuthPage />} />
          <Route path="auth/login" element={<AuthPage />} />
        </Route>

        <Route element={<PrivateRoute />}>
          <Route path="/" element={<HomePage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
