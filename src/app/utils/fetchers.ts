import { getDoc } from "firebase/firestore";

import refs from "../../firebase/utils/refs";
import { User } from "../../types/client";
import { useChat } from "../stores";

/**
 *
 * @param id id użytkownika
 * @returns Zwraca użytkownika jeśli istnieje w przeciwnym przypadku `null`.
 */
export const fetchUserById = async (id: string) => {
  const document = await getDoc(refs.users.doc(id));
  const user = document.data();
  return user ? user : null;
};

/**
 *
 * @param ids id użytkowników
 * @returns Zwraca tablice użytkowników w postaci `User[]`. Nie istniejący użytkownikcy są pomijani.
 */
export const fetchUsersWithIds = async (ids: string[]): Promise<User[]> => {
  const promises = ids.map((id) => useChat.getState().getUserById(id));
  const users = await Promise.all(promises);
  // @ts-ignore
  return users.filter((user) => user !== undefined);
};
