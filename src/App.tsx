import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/login";
import Register from "./pages/register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/zaloguj-sie" element={<Login />} />
        <Route path="/stworz-konto" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
