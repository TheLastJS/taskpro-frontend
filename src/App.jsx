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
        <Route path="/" element={
          <PublicRoute restricted={true}>
            <WelcomePage />
          </PublicRoute>
        } />
        <Route path="/auth/register" element={
          <PublicRoute restricted={true}>
            <RegisterForm />
          </PublicRoute>
        } />
        <Route path="/auth/login" element={
          <PublicRoute restricted={true}>
            <LoginForm />
          </PublicRoute>
        } />
        <Route path="/home" element={
          <PublicRoute restricted={true}>
            <HomePage />
          </PublicRoute>
        } />
        <Route path="/x" element={
          <PrivateRoute>
            <HomePage />
          </PrivateRoute>
        } />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
