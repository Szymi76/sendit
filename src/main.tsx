import "./index.css";

import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import theme from "./mui/theme";
// import { SessionProvider } from "./providers/SessionProvider";
import { ChatProvider } from "./providers/ChatProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      {/* <SessionProvider> */}
      <ChatProvider>
        <App />
      </ChatProvider>
      {/* </SessionProvider> */}
    </ThemeProvider>
  </React.StrictMode>,
);
