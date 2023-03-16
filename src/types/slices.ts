import { Chat, Message, User } from "./client";
import { ChatRole, ChatType } from "./other";

export type UsersSlice = {
  /**
   * Aktualnie zalogowany użytkownik pobierany z bazy danych.
   */
  currentUser: User | null;
  /**
   * Znajomi użytkownika w postaci tablicy.
   */
  friends: User[];
  /**
   * Tablica wcześniej pobranych użytkowników. Stosowana w celach optymalizacyjnych.
   */
  users: User[];
  /**
   * @param id id użytkownika
   * @description Dodaje / Usuwa użytkownika jako znajomego.
   */
  toggleUserAsFriend: (id: string) => Promise<void>;
  /**
   * @param id id użytkownikam
   * @returns Zwraca użytkownika na podstawie `id`. Jeśli użytkownik nie istnieje zwraca `null`.
   */
  getUserById: (id: string) => Promise<User | null>;
};

export type ChatsSlice = {
  /**
   * Tablica czatów w których uczestniczy użytkownik.
   */
  chats: Chat[];
  /**
   * Zwraca aktualnie subskrybowany czat.
   */
  currentChat: Chat | null;

  /**
   * Aktualnie subskrybowany czat w postaci `id` czatu, jeśli żaden czat nie jest subskrybowany to wartość przyjmuje wartość `null`.
   */
  subscribingTo: string | null;
  /**
   * Subskrypcja czatu czekająca w kolejce. Wartość przyjmuje `id` czatu. Jeśli żaden czat nie znajduję się w kolejece
   * to wartość przyjmuje `null`. Kolejka jest używana gdy potrzeba jest subskrybowania czatu, który jescze nie został
   * pobrany przez funkcję `onSnapshot`.
   */
  subscriptionInQueue: string | null;

  /**
   * Zmiana na `true` powoduje pobranie większej ilości wiadomości, po pobraniu wartość zmieniana jest na `false`.
   */
  fetchMoreMessages: boolean;
  /**
   * Mapa przechowuje wiadomości czatu na podstawie id.
   */
  messages: Map<string, Message[]>;
  /**
   *
   * @param id id czatu który chcemy dodać do kolejki
   * @description Dodaje `id` czatu do kolejki.
   */
  subscribeQueue: (id: string | null) => void;
  /**
   *
   * @param id id czatu
   * @returns Zwraca czat jeśli istnieje w innym przypadku `null`.
   */
  getChatById: (id: string) => Chat | null;
  /**
   *
   * @param chatId id czatu
   * @returns Zwraca wiadomości w postaci `Message[]` lub `[]` w przypadku braku czatu.
   */
  getMessagesWithChatId: (chatId: string) => Message[];
  /**
   *
   * @param id id czatu który chcemy subskrybować
   * @description subskrybuje konkretny czat
   */
  subscribe: (id: string | null) => void;
  /**
   *
   * @param ids id uczestników
   * @param type typ czatu
   * @param name nazwa nowego czatu
   * @param photo zdjęcie
   * @description Tworzy nowy czat. Automatycznie dodaje `id` nowego czatu do kolejki.
   */
  createChat: (ids: string[], type: ChatType, name: string, photo?: string | File) => Promise<string>;
  /**
   *
   * @param chatId id czatu do którego wysyłamy wiadomość
   * @param text tekst wiadomość
   * @param files pliki wiadomośći
   * @description Wysyła wiadomość do czatu. Autorem jest aktualnie zalogowany użytkownik.
   */
  sendMessage: (chatId: string, text: string, files?: string[] | File[]) => Promise<void>;
  /**
   *
   * @param chatId id czatu
   * @param name nowa nazwa
   * @param photo nowe zdjęcie
   * @description Aktualizuje czat.
   */
  updateChat: (
    chatId: string,
    toUpdate: {
      newName?: string;
      newPhoto?: string | File | null;
      newParticipants?: { uid: string; role: ChatRole }[];
    },
  ) => Promise<void>;
  /**
   *
   * @param chatId id czatu
   * @description Usuwa czat i wszystkie jego wiadomości.
   */
  deleteChat: (chatId: string) => Promise<void>;
  /**
   *
   * @param chatId id czatu
   * @param messages tablica wiadomości
   * @returns dodaje wiadomości do mapy
   */
  mergeMessages: (chatId: string, ...messages: Message[]) => void;
  /**
   *
   * @param uid id użytkownika
   * @param chatId id czatu
   * @param defaultRole rola, która zostanie zwrócona, jeśli użytkownika nie ma w podanym czacie
   * @returns Zwraca role użytkownika w czacie
   */
  getUserRole: (uid: string, chatId: string, defaultRole?: ChatRole) => ChatRole;
  /**
   * @param chat czat
   * @returns Zwraca nazwę czatu na podstawie tego czy czat jest indywidualny lub grupowy.
   */
  getChatName: (chat: Chat) => string;
  /**
   *
   * @param chat chat
   * @returns Zwraca zdjęcie czatu na podstawie tego czy czat jest indywidualny lub grupowy.
   */
  getChatPhoto: (chat: Chat) => string | null;
};

export type Status = { isLoading: boolean; isError: boolean };
export type StatusesSlice = {
  /**
   * Stan podczas wysyłania wiadomości.
   */
  sendingMessage: Status;
  /**
   * Stan podczas tworzenia nowego czatu.
   */
  creatingChat: Status;
  /**
   * Stan podczas pobierania czatów.
   */
  fetchingChats: Status;
  /**
   * Aktualizuje wybrany stan
   */
  updateStatuses: (statesToUpdate: Partial<StatusesSlice>) => void;
};

export type StatesSlice = {
  isChatListVisible: boolean;
  chnageChatListVisibilityTo: (show: boolean) => void;
  isChatSettingsVisible: boolean;
  changeChatSettingsVisibilityTo: (show: boolean) => void;
  isCreateNewChatVisible: boolean;
  changeCreateNewChatVisibilityTo: (show: boolean) => void;
  isUserSettingsVisible: boolean;
  changeUserSettingsVisibility: (show: boolean) => void;
  isSearchDialogVisible: boolean;
  changeSearchDialogVisibility: (show: boolean) => void;
};
