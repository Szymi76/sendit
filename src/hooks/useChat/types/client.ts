/*
  Typy danych znjdujące się w aplikacji po przekonwertowaniu
*/

import { ChatRole } from "../../useChat/types/other";
import { db_Chat, db_Message } from "./database";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  friendsUids: string[];
  chatsIds: string[];
};

export type Message = Omit<db_Message, "author"> & {
  id: string;
  author: User | null;
};

export type Chat = Omit<db_Chat, "participants" | "messages"> & {
  id: string;
  participants: (User & { role: ChatRole })[];
};
