import "./styles/index.css";

import { ThemeProvider } from "@mui/material";
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import { ChatsProvider } from "./app/providers/ChatsProvider";
import { CurrentUserProvider } from "./app/providers/CurrentUserProvider";
import { FriendsProvider } from "./app/providers/FriendsProvider";
import { MessagesProvider } from "./app/providers/MessagesProvider";
import { SubscriptionProvider } from "./app/providers/SubscriptionProvider";
import { AuthProvider } from "./firebase/hooks/useAuth";
import { MuiProvider } from "./styles/MuiProvider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <MuiProvider>
      <AuthProvider>
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
      </AuthProvider>
    </MuiProvider>
  </React.StrictMode>,
);
