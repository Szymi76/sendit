import { createContext, useEffect } from "react";
import { shallow } from "zustand/shallow";

import useAuth from "../../../firebase/hooks/useAuth";
import useChat from "../index";

export const SubscriptionContext = createContext(null);

export type SubscriptionProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się subskrybowaniem czatu znajdującego się w kolejece.
 */
export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user, isLoading } = useAuth();
  const { chats, subscribe, subscribeQueue, subscriptionInQueue, getChatById, updateStates } = useChat(
    (state) => ({
      chats: state.chats,
      subscribe: state.subscribe,
      subscribeQueue: state.subscribeQueue,
      subscriptionInQueue: state.subscriptionInQueue,
      getChatById: state.getChatById,
      updateStates: state.updateStates,
    }),
    shallow,
  );

  useEffect(() => {
    if (isLoading || !user || !subscriptionInQueue) return;

    const chat = getChatById(subscriptionInQueue);
    if (!chat) return console.warn("Queued chat does not exists");

    subscribe(subscriptionInQueue);
    subscribeQueue(null);
    updateStates({ creatingChat: { isLoading: false, isError: false } });
  }, [chats, subscriptionInQueue]);

  return <SubscriptionContext.Provider value={null}>{children}</SubscriptionContext.Provider>;
};
