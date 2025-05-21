import { Navigate, NavLink, Route, Routes, BrowserRouter } from "react-router-dom";
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
      <BrowserRouter basename="/taskpro-frontend">
        <Routes>
          <Route element={<PublicRoute restricted={true} />}>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/auth/register" element={<RegisterForm />} />
            <Route path="/auth/login" element={<LoginForm />} />
          </Route>
          <Route element={<PrivateRoute />}>
            <Route
              path="/"
              element={<HomePage setTheme={setTheme} theme={theme} />}
            />
            <Route
              path="/home"
              element={<HomePage setTheme={setTheme} theme={theme} />}
            />
          </Route>
          <Route path="/auth/:type" element={<AuthPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
