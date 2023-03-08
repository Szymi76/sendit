import useChat from "..";

/**
 *
 * @param chatId id czatu
 * @param min minimalna ilość wiadomości, aby mogła być przyjęta jako podstawa limitu
 * @param toFetch liczba wiadomości, które mają zostać pobrane
 * @param fetchNew jeśli wartość przyjmuje `true` to pobranych zostanie `podstawa` + `liczba
 * wiadomości do pobrania`.
 */
export const createMessagesLimit = (chatId: string, min: number, toFetch: number, fetchNew: boolean) => {
  const exisitngChat = useChat.getState().getChatById(chatId)!;
  const messagesLen = exisitngChat.messages.length;

  let limit = messagesLen > min ? messagesLen : toFetch;
  if (fetchNew) limit = messagesLen + toFetch;

  return limit;
};
