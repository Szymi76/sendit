import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useEffect } from "react";

import { firestore } from "../../firebase";
import useAuth from "../../firebase/hooks/useAuth";
import refs from "../../firebase/utils/refs";
import { useChat } from "../stores";
import { convertMessage } from "../utils/converters";
import { createMessagesLimit } from "../utils/others";

export const MessagesContext = createContext(null);

export type MessagesProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się nasłuchiwaniem na zmiany wiadomości w subskrybowanym czacie.
 */
export const MessagesProvider = ({ children }: MessagesProviderProps) => {
  const { user, isLoading } = useAuth();

  const subscribingTo = useChat((state) => state.subscribingTo);
  const getChatById = useChat((state) => state.getChatById);
  const fetchMoreMessages = useChat((state) => state.fetchMoreMessages);

  useEffect(() => {
    if (isLoading || !user || !subscribingTo) return;

    const newLimit = createMessagesLimit(subscribingTo, 10, 10, fetchMoreMessages);

    const q = query(refs.messages.col(subscribingTo), orderBy("createdAt", "desc"), limit(newLimit));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chat = getChatById(subscribingTo);

      if (!chat) return console.warn(`Chat with id: ${subscribingTo} does not exists`);

      const messagesFromDb = snapshot.docs;
      const messagesPromises = messagesFromDb.map((doc) => convertMessage(doc.data(), doc.id));
      const messages = await Promise.all(messagesPromises);
      useChat.getState().mergeMessages(chat.id, ...messages);
      useChat.setState({ fetchMoreMessages: false });
    });

    return unsubscribe;
  }, [firestore, user, subscribingTo, fetchMoreMessages]);

  return <MessagesContext.Provider value={null}>{children}</MessagesContext.Provider>;
};
