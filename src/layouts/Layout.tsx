import { Outlet } from "react-router-dom";

import { auth } from "../firebase";

const Layout = () => {
  return <Outlet />;
};

export default Layout;
