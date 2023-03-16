import { collection, CollectionReference, doc, DocumentReference } from "firebase/firestore";

import { User } from "../../types/client";
import { db_Chat, db_Message } from "../../types/database";
import { firestore } from "../index";

// PROD
const USERS_COL_NAME = "users";
const CHATS_COL_NAME = "chats";
const CHATS_MESSAGES_COL_NAME = "chatMessages";
const MESSAGES_COL_NAME = "messages";

// DEV
// const USERS_COL_NAME = "users_dev";
// const CHATS_COL_NAME = "chats_dev";
// const CHATS_MESSAGES_COL_NAME = "chatMessages_dev";
// const MESSAGES_COL_NAME = "messages_dev";

const refs = {
  users: {
    doc: (id: string) => doc(firestore, USERS_COL_NAME, id) as DocumentReference<User>,
    col: collection(firestore, USERS_COL_NAME) as CollectionReference<User>,
  },
  chats: {
    doc: (id: string) => doc(firestore, CHATS_COL_NAME, id) as DocumentReference<db_Chat>,
    col: collection(firestore, CHATS_COL_NAME) as CollectionReference<db_Chat>,
  },
  chatMessages: {
    col: collection(firestore, CHATS_MESSAGES_COL_NAME),
  },
  messages: {
    col: (id: string) => collection(refs.chatMessages.col, id, MESSAGES_COL_NAME) as CollectionReference<db_Message>,
  },
};

export default refs;
