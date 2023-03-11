import { Chat } from "../../../hooks/useChat/types/client";
import { ChatType } from "../../../hooks/useChat/types/other";

export type Filter = ChatType | "recent";

// filtrowanie chatów w liście, których nazwa nawiera podane zapytanie lub któryś z uczesników zawiera podane zapytanie
export const filterChats = (chats: Chat[], query: string, type?: Filter) => {
  let array = chats.filter((chat) => {
    const a = chat.name.toLocaleLowerCase().includes(query);
    const b = chat.participants.some((p) => p && p.displayName.toLocaleLowerCase().includes(query));
    return a || b;
  });

  array = array.sort((a, b) => +b.createdAt.toDate() - +a.createdAt.toDate());

  if (type && type != "recent") array = array.filter((chat) => chat.type == type);

  return array;
};
