import { Chat, UserObject } from "../../../firebase/collections";

// filtrowanie chatów w liście, których nazwa nawiera podane zapytanie lub któryś z uczesników zawiera podane zapytanie
export const filterChats = (chats: Map<string, Chat>, query: string, currentUser: UserObject | null) => {
  if (!currentUser) return new Map<string, Chat>();

  return new Map(
    Array.from(chats).filter(([id, chat]) => {
      const name = chat.name;
      const participantsNames = chat.participants
        .map((p) => p.val?.displayName)
        .filter((n) => n != currentUser?.val?.displayName);
      return name.includes(query) || participantsNames.some((p) => p && p.includes(query));
    }),
  );
};
