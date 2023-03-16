/* 
  Funkcje do konwertowania danych pobranym z bazy danych
*/

import { Chat, Message, User } from "../../types/client";
import { db_Chat, db_Message, db_User } from "../../types/database";
import { useChat } from "../stores";

/**
 *
 * @param dbUser użytkownik z bazy danych
 * @returns Zwraca użytkownika z podmienionymi wymaganymi wartościami
 */
export const convertUser = async (dbUser: db_User): Promise<User> => {
  const user: User = dbUser;
  return user;
};

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
 * @returns Zwraca czat z podmienionymi wymaganymi wartościami
 */
export const convertChat = async (dbChat: db_Chat, docId: string): Promise<Chat> => {
  const usersPromises = dbChat.participants.map((user) => useChat.getState().getUserById(user.userRef.id));
  const users = await Promise.all(usersPromises);
  // @ts-ignore
  const filteredUsers: User[] = users.filter((user) => user != null)!;
  const participants = filteredUsers.map((user) => {
    const role = dbChat.participants.find((parti) => parti.userRef.id == user.uid)!.role;
    return { ...user, role };
  });

  return { ...dbChat, participants, id: docId };
};
