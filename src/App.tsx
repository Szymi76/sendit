import { enableMapSet } from "immer";
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";

import * as Access from "./layouts/Access";
import Layout from "./layouts/Layout";
import Chat from "./pages/chat";
import Login from "./pages/login";
import NotFound from "./pages/NotFound/index";
import Register from "./pages/register";

const App = () => {
  enableMapSet();

  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Access.NotAuthenticated />}>
            <Route path="/zaloguj-sie" element={<Login />} />
            <Route path="/stworz-konto" element={<Register />} />
          </Route>
          <Route element={<Access.Authenticated />}>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
