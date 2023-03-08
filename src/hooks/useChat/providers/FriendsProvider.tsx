import { createContext, useEffect } from "react";
import { useCallback } from "react";

import useAuth from "../../../firebase/hooks/useAuth";
import useChat from "../index";
import { fetchUsersWithIds } from "../utils/fetchers";

export const FriendsContext = createContext(null);

export type FriendsProviderProps = { children: React.ReactNode };

/**
 *
 * Provider zajmuję się pobieraniem aktualnej listy znajomych.
 */
export const FriendsProvider = ({ children }: FriendsProviderProps) => {
  const { user, isLoading } = useAuth();
  const currentUser = useChat((state) => state.currentUser);

  const fetchFriends = useCallback(async () => {
    if (!currentUser) return;

    const friendsUids = currentUser.friends;
    const friends = await fetchUsersWithIds(friendsUids);
    useChat.setState({ friends });
  }, [currentUser]);

  useEffect(() => {
    if (isLoading || !user) return;

    fetchFriends();
  }, [currentUser]);

  return <FriendsContext.Provider value={null}>{children}</FriendsContext.Provider>;
};
