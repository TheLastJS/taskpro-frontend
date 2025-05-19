/* eslint-disable react/prop-types */
import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsLoggedIn } from "../redux/auth/authSelectors";

const PublicRoute = ({ restricted = false }) => {

  const isLoggedIn = useSelector(selectIsLoggedIn);

  const shouldRedirect = isLoggedIn && restricted;
  return shouldRedirect ? <Navigate to="/home" /> : <Outlet />;
};

export default PublicRoute;