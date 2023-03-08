import { onSnapshot } from "firebase/firestore";
import { createContext, useEffect } from "react";

import { firestore } from "../../../firebase";
import useAuth from "../../../firebase/hooks/useAuth";
import useChat from "../index";
import { Chat } from "../types/client";
import { convertChat } from "../utils/converters";
import refs from "../utils/refs";

export const ChatContext = createContext(null);

export type ChatsProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się nasłuchiwaniem na czaty w których znajduje się użytkownik.
 */
export const ChatsProvider = ({ children }: ChatsProviderProps) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) return;

    const currentUserRef = refs.users.doc(user.uid);
    // const q = query(refs.chats.col, where("participants", "array-contains", { ref: currentUserRef, val: null }));

    const unsubscribe = onSnapshot(refs.chats.col, async (snapshot) => {
      const chats: Chat[] = [];

      // informacja o rozpoczęciu pobierania
      useChat.getState().updateStates({ fetchingChats: { isLoading: true, isError: false } });

      // pętla konwertująca każdy czat
      for (let i = 0; i < snapshot.docs.length; i++) {
        const chatId = snapshot.docs[i].id;
        const chat = snapshot.docs[i].data();

        const convertedChat = await convertChat(chat, chatId);
        chats.push(convertedChat);
      }

      // informacja o zakończeniu pobierania
      useChat.getState().updateStates({ fetchingChats: { isLoading: false, isError: false } });

      // aktualizowanie czatów
      useChat.setState({ chats });
    });

    return unsubscribe;
  }, [firestore, user]);

  return <ChatContext.Provider value={null}>{children}</ChatContext.Provider>;
};
