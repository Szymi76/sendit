import { getDocs, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { createContext, useEffect } from "react";

import { firestore } from "../../firebase";
import useAuth from "../../firebase/hooks/useAuth";
import refs from "../../firebase/utils/refs";
import { Chat } from "../../types/client";
import { useChat } from "../stores";
import { convertChat, convertMessage } from "../utils/converters";

export const ChatContext = createContext(null);

export type ChatsProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się nasłuchiwaniem na czaty w których znajduje się użytkownik.
 */
export const ChatsProvider = ({ children }: ChatsProviderProps) => {
  const { user, isLoading } = useAuth();
  const updateStatuses = useChat((state) => state.updateStatuses);

  useEffect(() => {
    if (isLoading || !user) return;

    const q = query(refs.chats.col, where("participantsUids", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chats: Chat[] = [];

      // informacja o rozpoczęciu pobierania
      updateStatuses({ fetchingChats: { isLoading: true, isError: false } });

      // pętla konwertująca każdy czat
      for (let i = 0; i < snapshot.docs.length; i++) {
        const chatId = snapshot.docs[i].id;
        const chat = snapshot.docs[i].data();

        const convertedChat = await convertChat(chat, chatId);

        // pobieranie ostatniej wiadomości czatu
        const messagesRef = refs.messages.col(chatId);
        const q = query(messagesRef, orderBy("createdAt", "desc"), limit(1));
        const lastMessageAsArr = await (await getDocs(q)).docs;
        const lastMessage = lastMessageAsArr.length > 0 && lastMessageAsArr[0].data() ? lastMessageAsArr[0] : null;

        if (lastMessage) {
          const convertedMessage = await convertMessage(lastMessage.data(), lastMessage.id);
          useChat.getState().mergeMessages(chatId, convertedMessage);
        }

        chats.push(convertedChat);
      }

      // informacja o zakończeniu pobierania
      updateStatuses({ fetchingChats: { isLoading: false, isError: false } });

      // aktualizowanie czatów
      useChat.setState({ chats });
    });

    return unsubscribe;
  }, [firestore, user]);

  return <ChatContext.Provider value={null}>{children}</ChatContext.Provider>;
};
