//
//
// Struktury danych, które znajdują się w bazie danych.
//
//

import { DocumentReference, Timestamp } from "firebase/firestore";

import { User } from "./client";
import { ChatRole, ChatRolesArray, ChatType } from "./other";

export type db_Message = {
  author: DocumentReference<User>;
  text: string;
  files: string[];
  createdAt: Timestamp;
};

export type db_Chat = {
  participants: DocumentReference<User>[];
  participantsIdsAsString: string;
  roles: ChatRolesArray;
  photoURL: string | null;
  name: string;
  type: ChatType;
  createdAt: Timestamp;
  messages: db_Message[] | null;
};
