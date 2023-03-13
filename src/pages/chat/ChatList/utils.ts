import { Chat, Message } from "../../../hooks/useChat/types/client";
import { ChatType } from "../../../hooks/useChat/types/other";

export type Filter = ChatType | "recent";

// filtrowanie chatów w liście, których nazwa nawiera podane zapytanie lub któryś z uczesników zawiera podane zapytanie
export const filterChats = (chats: Chat[], query: string, messages: Map<string, Message[]>, type?: Filter) => {
  let array = chats.filter((chat) => {
    const a = chat.name.toLocaleLowerCase().includes(query);
    const b = chat.participants.some((p) => p && p.displayName.toLocaleLowerCase().includes(query));
    return a || b;
  });

  array = array.sort((a, b) => {
    const messagesA = messages.get(a.id);
    const messagesB = messages.get(b.id);
    if (!messagesA || !messagesB) return 0;

    const lastMsgA = messagesA[messagesA.length - 1];
    const lastMsgB = messagesB[messagesB.length - 1];
    if (!lastMsgA || !lastMsgB) return 0;

    return +lastMsgB.createdAt.toDate() - +lastMsgA.createdAt.toDate();
  });

  if (type && type != "recent") array = array.filter((chat) => chat.type == type);

  return array;
};
