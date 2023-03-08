//
// Funkcje do konwertowania danych otrzymanych z bazy danych
//

import useChat from "../index";
import { Chat, Message } from "../types/client";
import { db_Chat, db_Message } from "../types/database";

/**
 *
 * @param dbMessage wiadomości z bazy danych
 * @returns Zwraca wiadomość z podmienionymi wartościami w postaci `Message`.
 */
export const convertMessage = async (dbMessage: db_Message, docId: string): Promise<Message> => {
  const author = await useChat.getState().getUserById(dbMessage.author.id);
  return { ...dbMessage, author, id: docId };
};

/**
 *
 * @param dbChat czat z bazy danych
 * @param docId id czatu / dokumentu
 * @returns Zwraca czat z podmienionymi wartościami w postaci `Chat`.
 * Jeśli wiadomości posiadają wartość `null` to wiadomości przyjmują wartość `[]`.
 */
export const convertChat = async (dbChat: db_Chat, docId: string): Promise<Chat> => {
  const participantsPromises = dbChat.participants.map((ref) => useChat.getState().getUserById(ref.id));
  const participants = await Promise.all(participantsPromises);

  const messages: Message[] = [];
  // const existingChat = useChat.getState().getChatById(docId);
  // if (existingChat) messages = existingChat.messages;
  // else if (dbChat.messages) {
  //   const messagesPromises = dbChat.messages.map((msg) => convertMessage(msg));
  //   messages = await Promise.all(messagesPromises);
  // } else console.warn("Can't convert messages");

  return { ...dbChat, participants, messages, id: docId };
};
