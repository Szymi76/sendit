import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Login from "./pages/login";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/zaloguj-sie" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
