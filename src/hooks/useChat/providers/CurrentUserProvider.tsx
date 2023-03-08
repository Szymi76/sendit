import { onSnapshot } from "firebase/firestore";
import { createContext, useEffect } from "react";

import { firestore } from "../../../firebase";
import useAuth from "../../../firebase/hooks/useAuth";
import useChat from "../index";
import refs from "../utils/refs";

export const CurrentUserContext = createContext(null);

export type CurrentUserProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się nasłuchiwaniem na zmiany dokumentu użytkownika.
 */
export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading || !user) return;

    const currentUserRef = refs.users.doc(user.uid);

    const unsubscribe = onSnapshot(currentUserRef, (snapshot) => {
      const currentUser = snapshot.data() ?? null;
      useChat.setState({ currentUser });
    });

    return unsubscribe;
  }, [firestore, user]);

  return <CurrentUserContext.Provider value={null}>{children}</CurrentUserContext.Provider>;
};
