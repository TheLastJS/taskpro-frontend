import { Navigate, NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import PublicRoute from "./routes/PublicRoute";
import PrivateRoute from "./routes/PrivateRoute";
import HomePage from "./pages/HomePage/HomePage";
import WelcomePage from "./pages/WelcomePage/WelcomePage";
import AuthPage from "./pages/AuthPage/AuthPage";
import { ToastContainer } from "react-toastify";

function App({ setTheme, theme }) {
  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute restricted={true} />}>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/welcome" element={<WelcomePage />} />
          {/* Tek bir AuthPage ile login/register kontrolü */}
          <Route path="/auth/:type" element={<AuthPage />} />
        </Route>

        {/* Private Routes */}
        <Route element={<PrivateRoute />}>
          <Route
            path="/home"
            element={<HomePage setTheme={setTheme} theme={theme} />}
          />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Navigate to="/welcome" />} />
      </Routes>
    </div>
  );
}

export default App;
