import { addDoc, collection, CollectionReference, doc, getDocs, onSnapshot } from "firebase/firestore";
import produce from "immer";
import React, { useCallback, useEffect, useState } from "react";
import { useImmer } from "use-immer";

import { firestore } from "../../firebase";
import { User } from "../../firebase/collections";
import { useChat } from "../../providers/ChatProvider";
import ActiveChat from "./ActiveChat";
import ChatsList from "./ChatsList";
import CreateNewChat from "./CreateNewChat";
import UsersPanel from "./UsersPanel";

const ChatPage = () => {
  const [usersList, setUsersList] = useState<User[]>([]);

  // lista wszystkich użytkowników
  useEffect(() => {
    const ref = collection(firestore, "users") as CollectionReference<User>;
    const users: User[] = [];
    getDocs(ref).then((docs) => {
      docs.forEach((doc) => {
        const fetchedUser = doc.data();
        if (fetchedUser) users.push(fetchedUser);
      });
      setUsersList(users);
    });
  }, [firestore]);

  return (
    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
      <UsersPanel />
      <CreateNewChat />
      <ChatsList />
      <ActiveChat />
    </div>
  );
};

export default ChatPage;
