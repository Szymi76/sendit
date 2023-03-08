import { collection, CollectionReference, doc, DocumentReference } from "firebase/firestore";

import { firestore } from "../../../firebase";
import { User } from "../types/client";
import { db_Chat, db_Message } from "../types/database";

const refs = {
  users: {
    doc: (id: string) => doc(firestore, "users", id) as DocumentReference<User>,
    col: collection(firestore, "users") as CollectionReference<User>,
  },
  chats: {
    doc: (id: string) => doc(firestore, "chats", id) as DocumentReference<db_Chat>,
    col: collection(firestore, "chats") as CollectionReference<db_Chat>,
  },
  chatMessages: {
    col: collection(firestore, "chatMessages"),
  },
  messages: {
    col: (id: string) => collection(refs.chatMessages.col, id, "messages") as CollectionReference<db_Message>,
  },
};

export default refs;
