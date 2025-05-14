import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import PublicRoute from './routes/PublicRoute';
import PrivateRoute from './routes/PrivateRoute';
import HomePage from './pages/HomePage/HomePage';
import WelcomePage from './pages/WelcomePage/WelcomePage';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';

function App() {
  return (
     <div>
      <Routes>
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="auth/register" element={<RegisterForm />} />
          <Route path="auth/login" element={<LoginForm />} />
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
