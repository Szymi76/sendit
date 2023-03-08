import { CollectionReference, DocumentReference, Timestamp } from "firebase/firestore";

export type Uid = string;

export type User = {
  uid: string;
  displayName: string;
  email: string;
  friends: Uid[];
  photoURL: string | null;
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
  photoURL: string | null;
  name: string;
  type: ChatType;
  createdAt: Timestamp;
  messages: { ref: null; values: Message[] | null };
};

export type PrettyMessage = Omit<Message, "author"> & {
  author: User;
};

export type ChatPretty = Omit<Chat, "participants" | "messages"> & {
  participants: User[];
  messages: PrettyMessage[];
  chatId: string;
};
