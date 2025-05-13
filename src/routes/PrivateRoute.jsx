import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLoggedIn } from "../redux/auth/authSelectors";

const PrivateRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn); // Redux'tan isLoggedIn bilgisini al

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;