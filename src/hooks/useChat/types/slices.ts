import { Chat, Message, User } from "./client";
import { ChatRole, ChatRolesArray, ChatType } from "./other";

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
  /**
   * @param chat czat
   * @returns Zwraca nazwę czatu na podstawie tego czy czat jest indywidualny lub grupowy.
   */
  getChatName: (chat: Chat) => string;
  /**
   *
   * @param chatId id czatu
   * @param newParticipantsIds nowa tablica id użytkowników
   * @description Zmienia uczestników czatu.
   */
  changeChatParticipants: (chatId: string, newParticipantsIds: string[]) => Promise<void>;
};

export type ChatsSlice = {
  /**
   * Tablica czatów w których uczestniczy użytkownik.
   */
  chats: Chat[];
  /**
   *
   * @param chatId id czatu
   * @returns Zwraca wiadomości w postaci `Message[]` lub `[]` w przypadku braku czatu.
   */
  getMessagesWithChatId: (chatId: string) => Message[];
  /**
   * Zwraca aktualnie subskrybowany czat.
   */
  currentChat: Chat | null;
  /**
   *
   * @param id id czatu
   * @returns Zwraca czat jeśli istnieje w innym przypadku `null`.
   */
  getChatById: (id: string) => Chat | null;
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
   *
   * @param chatId id czatu do którego mają zostać dodane wiadomośći
   * @param messages tablica wiadomości
   * @description Rozszerza, konkretny czat o wiadomości.
   */
  // addMessagesToChatWithId: (chatId: string, messages: Message[]) => void;
  /**
   *
   * @param id id czatu który chcemy dodać do kolejki
   * @description Dodaje `id` czatu do kolejki.
   */
  subscribeQueue: (id: string | null) => void;
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
  createChat: (ids: string[], type: ChatType, name: string, photo?: string | File) => Promise<void>;
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
  updateChat: (chatId: string, name?: string, photo?: string | File | null) => Promise<void>;
  /**
   *
   * @param chatId id czatu
   * @description Usuwa czat i wszystkie jego wiadomości.
   */
  deleteChat: (chatId: string) => Promise<void>;
  /**
   * Powoduje pobranie większej ilości wiadomości.
   */
  fetchMoreMessages: boolean;

  /**
   * Mapa przechowuje wiadomości czatu na podstawie id.
   */
  messages: Map<string, Message[]>;

  /**
   *
   * @param chatId id czatu
   * @param messages tablica wiadomości
   * @returns dodaje wiadomości do mapy
   */
  mergeMessages: (chatId: string, ...messages: Message[]) => void;
  /**
   *
   * @param chatId id czatu
   * @param newRolesArray tablica nowych rol uczestników
   * @description Zmienia role uczestników danego czatu. Dostępne role: `owner`, `admin` i `user`.
   */
  changeChatRoles: (chatId: string, newRolesArray: ChatRolesArray) => Promise<void>;
  /**
   *
   * @param uid id użytkownika
   * @param chatId id czatu
   * @param defaultRole rola, która zostanie zwrócona, jeśli użytkownika nie ma w podanym czacie
   * @returns Zwraca role użytkownika w czacie
   */
  getUserRole: (uid: string, chatId: string, defaultRole?: ChatRole) => ChatRole;
};

export type State = { isLoading: boolean; isError: boolean };

export type StatesSlice = {
  /**
   * Stan podczas wysyłania wiadomości.
   */
  sendingMessage: State;
  /**
   * Stan podczas tworzenia nowego czatu.
   */
  creatingChat: State;
  /**
   * Stan podczas pobierania czatów.
   */
  fetchingChats: State;
  /**
   * Aktualizuje wybrany stan
   */
  updateStates: (statesToUpdate: Partial<StatesSlice>) => void;
};

export type UseChatType = UsersSlice & ChatsSlice & StatesSlice;
