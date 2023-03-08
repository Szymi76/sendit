import { Chat } from "../../../hooks/useChat/types/client";
import { ChatsArray } from "../../../providers/ChatProvider";

// filtrowanie chatów w liście, których nazwa nawiera podane zapytanie lub któryś z uczesników zawiera podane zapytanie
export const filterChats = (chats: Chat[], query: string) => {
  const array = chats.filter((chat) => {
    const a = chat.name.toLocaleLowerCase().includes(query);
    const b = chat.participants.some((p) => p && p.displayName.toLocaleLowerCase().includes(query));
    return a || b;
  });

  return array;
};
