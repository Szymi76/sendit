import { Navigate, Outlet, useLocation } from "react-router-dom";

import useAuth from "../firebase/hooks/useAuth";
import Loading from "./Loading";

// ROUTE TYLKO DLA ZALOGOWANYCH UŻYTKOWNIKÓW
export const Authenticated = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if (isLoading) return <Loading />;
  else if (user) return <Outlet />;
  else return <Navigate to="/zaloguj-sie" state={{ from }} />;
};

// ROUTE TYLKO DLA NIE ZALOGOWANYCH UŻYTKOWNIKÓW
export const NotAuthenticated = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if (isLoading) return <Loading />;
  else if (user) return <Navigate to="/" state={{ from }} />;
  else return <Outlet />;
};
