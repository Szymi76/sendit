import { Outlet } from "react-router-dom";

import { auth } from "../firebase";
import useAuth from "../firebase/hooks/useAuth";

const Layout = () => {
  const { user } = useAuth();

  return <Outlet />;
};

export default Layout;
