//
//
// Struktury danych, które znajdują się w bazie danych
//
//

import { db_Chat, db_Message } from "./database";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  friends: string[];
  photoURL: string | null;
};

export type Message = Omit<db_Message, "author"> & {
  id: string;
  author: User | null;
};

export type Chat = Omit<db_Chat, "participants" | "messages"> & {
  id: string;
  participants: (User | null)[];
};
