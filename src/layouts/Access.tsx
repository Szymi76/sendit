import { Box } from "@mui/material";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Nav from "../components/Nav";
import useAuth from "../firebase/hooks/useAuth";
import Loading from "./Loading";

// route tylko dla zalogowanych użytkowników
export const Authenticated = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if (isLoading)
    return (
      <>
        <Nav />
        <Loading />
      </>
    );
  else if (user) return <Outlet />;
  else return <Navigate to="/zaloguj-sie" state={{ from }} />;
};

// route tylko dla NIE zalogowanych użytkowników
export const NotAuthenticated = () => {
  const { user, isLoading } = useAuth();
  const location = useLocation();
  const from = location.pathname;

  if (isLoading) return <Loading />;
  else if (user) return <Navigate to="/" state={{ from }} />;
  else return <Outlet />;
};

// route dla wszystkich
export const All = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};
