/* 
  Typy danych znajdujące się w bazie danych firebase
*/

import { DocumentReference, Timestamp } from "firebase/firestore";

import { ChatRole, ChatType } from "./other";

export type db_User = {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string | null;
  friendsUids: string[];
  chatsIds: string[];
};

export type db_Message = {
  author: DocumentReference<db_User>;
  text: string;
  files: string[];
  createdAt: Timestamp;
};

export type db_Chat = {
  participants: {
    userRef: DocumentReference<db_User>;
    role: ChatRole;
  }[];
  participantsUids: string[];
  photoURL: string | null;
  name: string;
  type: ChatType;
  createdAt: Timestamp;
  messages: db_Message[] | null;
};
