import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { createContext, useEffect } from "react";
import { shallow } from "zustand/shallow";

import { firestore } from "../../../firebase";
import useAuth from "../../../firebase/hooks/useAuth";
import useChat from "../index";
import { convertMessage } from "../utils/converters";
import { createMessagesLimit } from "../utils/others";
import refs from "../utils/refs";

export const MessagesContext = createContext(null);

export type MessagesProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się nasłuchiwaniem na zmiany wiadomości w subskrybowanym czacie.
 */
export const MessagesProvider = ({ children }: MessagesProviderProps) => {
  const { user, isLoading } = useAuth();

  const { subscribingTo, addMessagesToChatWithId, getChatById, fetchMoreMessages } = useChat(
    (state) => ({
      subscribingTo: state.subscribingTo,
      getChatById: state.getChatById,
      addMessagesToChatWithId: state.addMessagesToChatWithId,
      fetchMoreMessages: state.fetchMoreMessages,
    }),
    shallow,
  );

  useEffect(() => {
    if (isLoading || !user || !subscribingTo) return;

    const newLimit = createMessagesLimit(subscribingTo, 1, 10, fetchMoreMessages);

    const q = query(refs.messages.col(subscribingTo), orderBy("createdAt", "desc"), limit(newLimit));

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chat = getChatById(subscribingTo);

      if (!chat) return console.warn(`Chat with id: ${subscribingTo} does not exists`);

      const messagesFromDb = snapshot.docs;
      const messagesPromises = messagesFromDb.map((doc) => convertMessage(doc.data(), doc.id));
      const messages = await Promise.all(messagesPromises);
      addMessagesToChatWithId(chat.id, messages.reverse());
      useChat.setState({ fetchMoreMessages: false });
    });

    return unsubscribe;
  }, [firestore, user, subscribingTo, fetchMoreMessages]);

  return <MessagesContext.Provider value={null}>{children}</MessagesContext.Provider>;
};
