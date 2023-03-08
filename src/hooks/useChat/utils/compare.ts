import useChat from "..";
import { Chat } from "../types/client";

/**
 *
 * @param newChat chat
 * @returns Zwraca chat z podmienionymi wartościami, jeśli był już on wcześniej pobierany.
 */
export const compareChatAndReplace = (newChat: Chat): Chat => {
  const alreadyExisitngChat = useChat.getState().getChatById(newChat.id);
  if (!alreadyExisitngChat) return newChat;

  const { messages } = alreadyExisitngChat;

  return { ...newChat, messages };
};
