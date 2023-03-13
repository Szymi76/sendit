import { enableMapSet } from "immer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import * as Access from "./layouts/Access";
import Layout from "./layouts/Layout";
import Chat from "./pages/chat";
import ChatV4 from "./pages/chat";
import Login from "./pages/login";
import NotFound from "./pages/NotFound";
import Register from "./pages/register";
import Search from "./pages/search";

const App = () => {
  enableMapSet();

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route element={<Access.NotAuthenticated />}>
            <Route path="/zaloguj-sie" element={<Login />} />
            <Route path="/stworz-konto" element={<Register />} />
          </Route>
          <Route element={<Access.Authenticated />}>
            <Route path="/" element={<Navigate to="/chat" replace />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
