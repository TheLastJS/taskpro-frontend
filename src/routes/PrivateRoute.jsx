import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLoggedIn } from "../redux/Auth/selectors";

const PrivateRoute = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn); // Redux'tan isLoggedIn bilgisini al

  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;