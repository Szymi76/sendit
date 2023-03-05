import { enableMapSet } from "immer";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import * as Access from "./layouts/Access";
import Layout from "./layouts/Layout";
import Beta from "./pages/beta";
import Chat from "./pages/chat";
import ChatV2 from "./pages/chatComponents";
import Home from "./pages/home";
import Login from "./pages/login";
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
            <Route path="/private" element={<h1>Tylko dla zalogowanych</h1>} />
            <Route path="/chat" element={<Chat />} />
            <Route path="/search" element={<Search />} />
            <Route path="/chats" element={<ChatV2 />} />
            <Route path="/beta" element={<Beta />} />
          </Route>
          <Route element={<Access.All />}>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
