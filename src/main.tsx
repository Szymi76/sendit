import "./index.css";

import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ChatsProvider } from "./hooks/useChat/providers/ChatsProvider";
import { CurrentUserProvider } from "./hooks/useChat/providers/CurrentUserProvider";
import { FriendsProvider } from "./hooks/useChat/providers/FriendsProvider";
import { MessagesProvider } from "./hooks/useChat/providers/MessagesProvider";
import { SubscriptionProvider } from "./hooks/useChat/providers/SubscriptionProvider";
import theme from "./mui/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CurrentUserProvider>
        <FriendsProvider>
          <ChatsProvider>
            <MessagesProvider>
              <SubscriptionProvider>
                <App />
              </SubscriptionProvider>
            </MessagesProvider>
          </ChatsProvider>
        </FriendsProvider>
      </CurrentUserProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
