import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/HomePage/HomePage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import LoginForm from "./components/LoginForm/LoginForm";
import RegisterForm from "./components/RegisterForm/RegisterForm";
import AuthPage from "./pages/AuthPage/AuthPage";
import { ToastContainer } from 'react-toastify';

function App({ setTheme, theme }) {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/taskpro-frontend" element={<WelcomePage />} />
          <Route path="/taskpro-frontend/welcome" element={<WelcomePage />} />
          <Route path="/taskpro-frontend/auth">
            <Route path="login" element={<LoginForm />} />
            <Route path="register" element={<RegisterForm />} />
            <Route path=":type" element={<AuthPage />} />
          </Route>
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/taskpro-frontend/home" element={<HomePage setTheme={setTheme} theme={theme} />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/taskpro-frontend/welcome" />} />
      </Routes>
    </div>
  );
}

export default App;
