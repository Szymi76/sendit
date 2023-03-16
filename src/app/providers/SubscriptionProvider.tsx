import { createContext, useEffect } from "react";

import useAuth from "../../firebase/hooks/useAuth";
import { useChat } from "../stores";

export const SubscriptionContext = createContext(null);

export type SubscriptionProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się subskrybowaniem czatu znajdującego się w kolejece.
 */
export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user, isLoading } = useAuth();

  const chats = useChat((state) => state.chats);
  const subscribe = useChat((state) => state.subscribe);
  const subscribeQueue = useChat((state) => state.subscribeQueue);
  const subscriptionInQueue = useChat((state) => state.subscriptionInQueue);
  const getChatById = useChat((state) => state.getChatById);
  const updateStatuses = useChat((state) => state.updateStatuses);
  const subscribingTo = useChat((state) => state.subscribingTo);

  // zajmuję się kolekjowanie i subskrybowaniem czatu.
  useEffect(() => {
    if (isLoading || !user || !subscriptionInQueue) return;

    const chat = getChatById(subscriptionInQueue);
    if (!chat) return console.warn("Queued chat does not exists");

    subscribe(subscriptionInQueue);
    subscribeQueue(null);
    updateStatuses({ creatingChat: { isLoading: false, isError: false } });
  }, [chats, subscriptionInQueue]);

  // zajmuje się aktualizowaniem wartości `currentChat`.
  useEffect(() => {
    const currentChat = subscribingTo ? getChatById(subscribingTo) : null;
    useChat.setState({ currentChat });
  }, [chats, subscribingTo]);

  return <SubscriptionContext.Provider value={null}>{children}</SubscriptionContext.Provider>;
};
