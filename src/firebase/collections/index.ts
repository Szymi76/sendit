import { collection, CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";

import { firestore } from "..";

export type User = {
  uid: string;
  displayName: string;
  email: string;
  friends: string[];
  photoURL: string;
};

export type UserObject = { ref: DocumentReference<User>; val: User | null };
export type ChatType = "individual" | "group";

export type Message = {
  author: UserObject;
  text: string;
  files: string[] | Blob[];
  createdAt: Timestamp;
};

export type Chat = {
  participants: UserObject[];
  photoURL: string;
  name: string;
  type: ChatType;
  createdAt: Timestamp;
  messages: { ref: DocumentReference<{ messages: Message[] }>; values: Message[] | null };
};

// export const UsersCollection = collection(firestore, "users") as CollectionReference<User>;
// export const MessagesCollection = collection(firestore, "users") as CollectionReference<Message>;
// export const ChatsCollection = collection(firestore, "users") as CollectionReference<Chat>;
