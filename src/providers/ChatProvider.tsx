import { uuidv4 } from "@firebase/util";
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { createContext, useMemo, useState } from "react";
import { useCallback, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

import { firestore } from "../firebase";
import useAuth from "../firebase/hooks/useAuth";
import { Chat, ChatPretty, Message, PrettyMessage, User } from "../firebase/types";
import uploadFile from "../firebase/utils/uploadFile";

// const DEFAULT_PHOTO_URL = "https://sendbird.com/main/img/profiles/profile_05_512px.png";

/*
    --------------------------------------
    ------- Types for ChatProvider -------
    --------------------------------------
*/

export type ChatId = string;
export type Uid = string;
export type Value = { text: string; files?: string[] | File[] };
export type CreateChatReturn = { chatId: string; chat: Chat } | null;
export type UserObject = { ref: DocumentReference<User>; val: User | null };
export type ChatType = "individual" | "group";

export type ChatsArray = ChatPretty[];
export type ChatsMap = Map<ChatId, ChatPretty>;

export type StatusValues = { isLoading: boolean; isError: boolean };

export type Status = {
  creatingChat: StatusValues;
  sendingMessage: StatusValues;
  fetchingChats: StatusValues;
  fetchingRegisteredChat: StatusValues;
  updatingChat: StatusValues;
  deletingChat: StatusValues;
};

export type Utils = {
  getChatName: (chat: ChatPretty) => string;
};

export type ChatProviderProps = { children: React.ReactNode };

export type ChatContextType = {
  currentUser: UserObject | null;
  chats: Map<ChatId, Chat>;
  friendsList: Map<Uid, UserObject>;
  registeredChatId: string | null;
  status: Status;
  registerChat: (chatId: string | null) => Promise<void>;
  createChat: (
    participantsUids: string[],
    type: ChatType,
    name: string,
    photoURL?: File | string,
  ) => Promise<{ id: ChatId } | null>;
  sendMessage: (chatId: ChatId, value: Value) => Promise<void>;
  addFriend: (uid: string) => Promise<void>;
  removeFriend: (uid: string) => Promise<void>;
  updateChat: (chatId: string, name?: string, photoURL?: string | File | null) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  formatted: {
    user: User | null;
    friends: User[];
    chats: Readonly<[ChatsArray, ChatsMap]>;
  };
  utils: Utils;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ErrorMessage = "Hook is not ready, probably there is not user logged in.";

// initial values
const initialChatsValue = new Map<ChatId, Chat>();
const initialCurrentUser = null;
const initialFriendsList: Map<Uid, UserObject> = new Map<Uid, UserObject>();
const initialStatusValue: StatusValues = { isLoading: false, isError: false };
const initialStatus: Status = {
  creatingChat: initialStatusValue,
  sendingMessage: initialStatusValue,
  fetchingChats: { isLoading: false, isError: false },
  fetchingRegisteredChat: initialStatusValue,
  updatingChat: initialStatusValue,
  deletingChat: initialStatusValue,
};

/*
    ----------------------------
    ------- ChatProvider -------
    ----------------------------
*/

export const ChatProvider = ({ children }: ChatProviderProps) => {
  const { user, isLoading } = useAuth();
  const [registeredChatId, setRegisteredChatId] = useState<null | string>(null);
  const [chats, setChats] = useImmer(initialChatsValue);
  const [currentUser, setCurrentUser] = useImmer<UserObject | null>(initialCurrentUser);
  const [friendsList, setFriendsList] = useImmer(initialFriendsList);
  const [chatIdInQueue, setChatIdInQueue] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(initialStatus);
  const users = useMemo(() => new Map<string, UserObject>(), []);

  /*
    ------- funkcja do aktualizacji stanu ładowania lub błędu  -------
  */

  const updateStatus = (statusToUpdate: Partial<Status>) => {
    setStatus((status) => {
      return { ...status, ...statusToUpdate };
    });
  };

  /*
    ------- objekt z formatowanymi danymi  -------
  */

  const formatted = {
    /**
     * Zwraca dane aktualnie zalogowanego użytkownika z bazy dancyh
     */
    user: useMemo(() => {
      if (!currentUser || !currentUser.val) return null;
      return currentUser.val;
    }, [currentUser]),

    /**
     * Zamienia mapę znajomych na prostą tablice użytkowników
     * @example [firstFriend, secondFriend] as User[];
     */
    friends: useMemo(() => {
      const arrayFromMap = Array.from(friendsList);
      const array = arrayFromMap.map(([uid, userObject]) => {
        const user = userObject.val;
        return user ? user : null;
      });
      // @ts-ignore
      const filteredArray: User[] = array.filter((user) => user != null);
      return filteredArray;
    }, [friendsList]),

    /**
     * Zamienia mapę chatów na ładniejszą wersje gdzie uczestnicy i wiadomości to zwykłe tablice
     * @returns [array, map]
     */
    chats: useMemo(() => {
      const arrayFromMap = Array.from(chats);
      const array: ChatsArray = arrayFromMap.map(([chatId, chat]) => {
        let messagesBefore: Message[] | null = chat.messages.values;
        if (!messagesBefore) messagesBefore = [];

        // @ts-ignore
        const messages: PrettyMessage[] = messagesBefore
          .map((msg) => {
            return { ...msg, author: msg.author.val };
          })
          .filter((msg) => msg.author != null);

        // @ts-ignore
        const participants: User[] = chat.participants.map(({ ref, val }) => val).filter((user) => user != null);
        return { chatId, ...chat, participants, messages };
      });

      const map: ChatsMap = new Map(array.map((item) => [item.chatId, { ...item }]));

      return [array, map] as const;
    }, [chats]),
  };

  /*
    ------- funkcje pomocniecze służące do podmiany wartości w objektach, które przyszły z bazy danych  -------
  */

  const helpers = {
    /**
     * Zamienia użytkownika w postaci UserObject na zwykłego użytkownika
     */
    expandUserObject: useCallback(async (userObject: UserObject) => {
      const { ref } = userObject;
      const userFromRef = await getUserFromArrayOrFirebaseWithRef(ref);
      return { ...userObject, val: userFromRef };
    }, []),

    /**
     * Podmienia autorów dla każdej wiadomości z tablicy
     */
    expandMessagesArray: useCallback(async (messages: Message[]) => {
      const expandedMessages: Message[] = [];
      for (let i = 0; i < messages.length; i++) {
        const author = messages[i].author;
        const expandedAuthor = await helpers.expandUserObject(author);
        expandedMessages.push({ ...messages[i], author: expandedAuthor });
      }
      return expandedMessages;
    }, []),

    /**
     * Podmienia wymagane pola w czacie (wiadomości i uczestnicy)
     */
    expandSingleChat: useCallback(async (chat: Chat, expand: { messages: boolean; participants: boolean }) => {
      const participants = chat.participants;
      const expandedParticipants: UserObject[] = [];

      // rozszerzanie uczestników
      if (expand.participants) {
        for (let i = 0; i < participants.length; i++) {
          const parti = participants[i];
          const expandedParti = await helpers.expandUserObject(parti);
          expandedParticipants.push(expandedParti);
        }
      }

      const messages = chat.messages.values;
      let expandedMessages: Message[] = [];

      // rozszerzanie wiadomości
      if (expand.messages && messages) {
        expandedMessages = await helpers.expandMessagesArray(messages);
      }

      return {
        ...chat,
        messages: expand.messages ? { ...chat.messages, values: expandedMessages } : { ...chat.messages },
        participants: expand.participants ? expandedParticipants : participants,
      };
    }, []),
  };

  /*
    ------- funkcje pomocnicze do wyciągania różnych informacji  -------
  */

  const utils: Utils = {
    getChatName: (chat) => {
      if (!formatted.user) throw new Error(ErrorMessage);

      if (chat.type == "group") return chat.name;

      const otherUser = chat.participants.filter((parti) => parti.uid != formatted.user!.uid)[0];
      return otherUser.displayName;
    },
  };

  /*
    ------- dodawanie użytkownika do mapy -------
  */

  const addUserToArray = useCallback(({ ref, val }: UserObject) => {
    if (val) users.set(val.uid, { ref, val });
  }, []);

  /*
    ------- pobieranie użytkownika z bazy lub tablicy za pomocą uid -------
  */

  const getUserFromArrayOrFirebaseWithUid = useCallback(async (uid: string) => {
    const userObject = users.get(uid);
    if (userObject && userObject.val) return userObject.val;

    const ref = doc(firestore, "users", uid) as DocumentReference<User>;
    const fetchedUser = await (await getDoc(ref)).data();

    addUserToArray({ ref, val: fetchedUser ? fetchedUser : null });

    return fetchedUser ? fetchedUser : null;
  }, []);

  /*
    ------- pobieranie użytkownika z bazy lub tablicy za pomocą referencji -------
  */

  const getUserFromArrayOrFirebaseWithRef = useCallback(async (ref: DocumentReference<User>) => {
    const array = Array.from(users).map(([uid, value]) => value);
    // @ts-ignore
    const index = array.indexOf({ ref });
    if (index > -1 && array[index].val) return array[index].val;

    const fetchedUser = await (await getDoc(ref)).data();

    addUserToArray({ ref, val: fetchedUser ? fetchedUser : null });

    return fetchedUser ? fetchedUser : null;
  }, []);

  /*
    ------- pobieranie aktualnego użytkownika z bazy danych w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!user || isLoading) return;

    // referencja do aktualnie zalogowanego użytkownika
    const ref = doc(firestore, "users", user.uid) as DocumentReference<User>;

    // nasłuchiwanie na zmiany w dokumencie użytkownika
    const unsubcribe = onSnapshot(ref, (doc) => {
      const fetchedUser = doc.data();
      if (fetchedUser) {
        setCurrentUser({ ref: doc.ref, val: fetchedUser });
        addUserToArray({ ref: doc.ref, val: fetchedUser });
      }
    });

    return unsubcribe;
  }, [firestore, user]);

  /*
    ------- pobieranie listy znajomych w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!currentUser || !currentUser.val || isLoading) return;

    const fetchFriends = async () => {
      const fetchedFriendsArray = new Map<string, UserObject>();
      const friendsUids = currentUser.val!.friends;

      // iterowanie przez uid znajomych i poberanie dla każdego danych z bazy danych
      for (let i = 0; i < friendsUids.length; i++) {
        const uid = friendsUids[i];
        const ref = doc(firestore, "users", uid) as DocumentReference<User>;
        const friend = await getUserFromArrayOrFirebaseWithUid(uid);
        if (friend) {
          fetchedFriendsArray.set(uid, { ref, val: friend });
        }
      }
      return fetchedFriendsArray;
    };

    // pobieranie listy znajomych
    fetchFriends()
      .then((friendsList) => {
        setFriendsList(friendsList);
      })
      .catch((err) => {
        console.warn(err);
      });
  }, [firestore, currentUser]);

  /*
    ------- pobieranie wiadomości zarejestrowanego czatu w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!currentUser || !currentUser.val || isLoading) return;

    // nie pobieranie wiadomości, jeśli nie ma żadnego zarejestrowanego czatu
    if (!registeredChatId) return;

    try {
      // referencja do wiadomości zarejestrowanego czatu
      const ref = doc(firestore, "messages", registeredChatId) as DocumentReference<{ messages: Message[] }>;

      // nasłychiwanie na wiadomości w zarejestrowanym czcie
      const unsubcribe = onSnapshot(ref, async (snapshot) => {
        const chat = chats.get(registeredChatId);
        const document = snapshot.data();

        if (!document || !chat) {
          updateStatus({ fetchingRegisteredChat: { isLoading: false, isError: true } });
          return console.warn("Registered chat does not exist, probably chats has not been able to fetch");
        }

        // podmienianie wymaganych wartości w tablicy wiadomości
        const messagesArray = document.messages;
        const values = await helpers.expandMessagesArray(messagesArray);
        const messages = { ref, values };

        setChats((draft) => {
          draft.set(registeredChatId, { ...chat, messages });
        });

        // informacja o udanym pobraniu wiadomości
        updateStatus({ fetchingRegisteredChat: { isLoading: false, isError: false } });
      });

      return unsubcribe;
    } catch (err) {
      console.warn(err);
      updateStatus({ fetchingRegisteredChat: { isLoading: false, isError: true } });
    }
  }, [firestore, user, registeredChatId]);

  /*
    ------- pobieranie wszystkich czatów bez wiadomości w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!user || !currentUser || isLoading) return;

    try {
      // referencja do kolekji czatów
      const ref = collection(firestore, "chats") as CollectionReference<Chat>;
      const q = query(ref, where("participants", "array-contains", { ref: currentUser.ref, val: null }));

      // nasłuchiwanie na zmiany czatach
      const unsubcribe = onSnapshot(q, async (snapshot) => {
        // informacja o rozpoczęciu poberaniu czatów
        updateStatus({ fetchingChats: { isLoading: true, isError: false } });

        // ostateczna mapa z pobranymi czatami
        const fetchedChats = new Map<string, Chat>();

        // pętla podmieniająca dane w każdym czacie
        for (let i = 0; i < snapshot.docs.length; i++) {
          const chatId = snapshot.docs[i].id;
          const chat = snapshot.docs[i].data();
          const expandedChat = await helpers.expandSingleChat(chat, { messages: false, participants: true });

          fetchedChats.set(chatId, expandedChat);
        }

        setChats(fetchedChats);

        // informacja o udanym pobraniu czatów
        updateStatus({ fetchingChats: { isLoading: false, isError: false } });
      });

      return unsubcribe;
    } catch (err) {
      console.warn(err);
      updateStatus({ fetchingChats: { isLoading: false, isError: true } });
    }
  }, [firestore, currentUser]);

  /*
    ------- Czekanie na zakolejkowany czat -------
  */

  useEffect(() => {
    if (!chatIdInQueue) return;

    try {
      const chat = chats.get(chatIdInQueue);
      if (!chat) return;
      console.warn("Queued chat is not exists");

      // jeśli znalazł się czat z kolejki, to ustawianie zarejestrowanego czatu na ten z kolejki
      setRegisteredChatId(chatIdInQueue);
      setChatIdInQueue(null);
    } catch (err) {
      console.warn(err);
    }
  }, [chats, chatIdInQueue]);

  /*
    ------- rejestrowanie czatu  -------
  */

  const registerChat = useCallback(
    async (chatId: string | null) => {
      try {
        if (chatId === null) setRegisteredChatId(null);
        else {
          const chat = chats.get(chatId);
          if (!chat) throw new Error("Can't register not exsisting chat");
        }
      } catch (err) {
        console.warn(err);
      }

      setRegisteredChatId(chatId);
    },
    [chats],
  );

  /*
    ------- dodawanie znajomego w czasie rzeczywistym  -------
  */

  const addFriend = useCallback(
    async (otherUserUid: string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      try {
        // referecja do aktualnie zalogowanego użytkownika i drugiego, którego chcemy usunąć ze znajomych
        const currentUserRef = currentUser.ref;
        const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

        // poberanie informacji o drugim użytkowniku
        const otherUser = await (await getDoc(otherUserRef)).data();
        if (!otherUser) return console.warn("Can't add to friends not existing user");

        // dodawanie przeciwnych uid
        await updateDoc(currentUserRef, { friends: arrayUnion(otherUser.uid) });
        await updateDoc(otherUserRef, { friends: arrayUnion(currentUser.val.uid) });
      } catch (err) {
        console.warn(err);
      }
    },
    [currentUser],
  );

  /*
    ------- usuwanie znajomego w czasie rzeczywistym  -------
  */

  const removeFriend = useCallback(
    async (otherUserUid: string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      try {
        // referecja do aktualnie zalogowanego użytkownika i drugiego, którego chcemy usunąć ze znajomych
        const currentUserRef = currentUser.ref;
        const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

        // poberanie informacji o drugim użytkowniku
        const otherUser = await (await getDoc(otherUserRef)).data();
        if (!otherUser) return console.warn("Can't remove not existing user");

        // pozbywanie się przeciwnych uid
        await updateDoc(currentUserRef, { friends: arrayRemove(otherUser.uid) });
        await updateDoc(otherUserRef, { friends: arrayRemove(currentUser.val.uid) });
      } catch (err) {
        console.warn(err);
      }
    },
    [currentUser],
  );

  /*
    ------- wysyłanie wiadomości w czasie rzeczywistym  -------
  */

  const sendMessage = useCallback(
    async (chatId: ChatId, value: Value) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      try {
        // informacja o rozpoczęciu przesyłania wiadomości
        updateStatus({ sendingMessage: { isLoading: true, isError: false } });

        // referencja do dokumentu wiadomości
        const ref = doc(firestore, "messages", chatId) as DocumentReference<{ messages: Message[] }>;
        const authorRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;

        const filesUrls: string[] = [];
        if (value.files) {
          for (let i = 0; i < value.files.length; i++) {
            const file = value.files[i];
            if (typeof file == "string") filesUrls.push(file);
            else {
              const filename = uuidv4();
              const url = await uploadFile(await file.arrayBuffer(), "chats/files", filename);
              filesUrls.push(url);
            }
          }
        }

        const newMessage: Message = {
          author: { ref: authorRef, val: null },
          text: value.text,
          files: filesUrls,
          createdAt: new Timestamp(+new Date() / 1000, 1000),
        };

        // dodoawanie wiadomości do tablicy przy pomocy funkcji arrayUnion()
        await updateDoc(ref, { messages: arrayUnion(newMessage) });

        // informacja o poprawnym wysłaniu wiadomości
        updateStatus({ sendingMessage: { isLoading: false, isError: false } });
      } catch (err) {
        console.warn(err);
        updateStatus({ sendingMessage: { isLoading: false, isError: true } });
      }
    },
    [chats, currentUser],
  );

  /*
    ------- tworzenie chatu(pokoju) w czasie rzeczywistym  -------
  */

  const createChat = useCallback(
    async (participantsUids: string[], type: ChatType, name: string, photoURL?: File | string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      try {
        // rozpoczęcie tworzenia czatu
        updateStatus({ creatingChat: { isLoading: true, isError: false } });

        // konwertowanie uczestników do tablicy UserObjekt[]
        const participants: UserObject[] = [];
        participantsUids.forEach((uid) => {
          const ref = doc(firestore, "users", uid) as DocumentReference<User>;
          participants.push({ ref, val: null });
        });

        // tymczasowa referencja bo ts się denerwuje
        const tempRef = doc(firestore, "messages", "_temp") as DocumentReference<{ messages: Message[] }>;

        const newChat = {
          participants,
          type,
          messages: { ref: tempRef, values: [] },
          name,
          photoURL: null,
          createdAt: new Timestamp(+new Date() / 1000, 1000),
        };

        // referencja do kolekcji czatów
        const ref = collection(firestore, "chats") as CollectionReference<Chat>;
        const { id } = await addDoc(ref, newChat);

        const messagesRef = doc(firestore, "messages", id) as DocumentReference<{ messages: Message[] }>;
        const chatRef = doc(firestore, "chats", id) as DocumentReference<Chat>;

        // aktualizacja zdjęcia czatu, jeśli zostało podane jako parametr
        if (photoURL && typeof photoURL != "string") {
          const arrayBuffer = await photoURL.arrayBuffer();
          const url = await uploadFile(arrayBuffer, "chats/main", id);
          photoURL = url;
        }

        // aktualizacja referencji wiadomości i zdjęcia czatu
        await updateDoc(chatRef, {
          photoURL: typeof photoURL == "string" ? photoURL : null,
          messages: { ref: messagesRef, values: [] },
        });

        // dodawnie dokumentu z wiadomościami czatu
        await setDoc(messagesRef, { messages: [] });

        // kolejkowanie stworzonego czatu,
        // [ nie można od razu zarejestrować czatu, ponieważ useEffect od czatów nie zdąży pobrać aktualnych czatów ]
        // [ rejestracja następuje w useEffekcie od kolejki! ]
        setChatIdInQueue(id);

        // informacja o udanym stworzeniu czatu
        updateStatus({ creatingChat: { isLoading: false, isError: false } });

        return { id };
      } catch (err) {
        console.warn(err);
        updateStatus({ creatingChat: { isLoading: false, isError: true } });
        return null;
      }
    },
    [currentUser],
  );

  /*
    ------- aktualizacja czatu na podstawie id  -------
  */

  const updateChat = useCallback(
    async (chatId: string, name?: string, photoURL?: string | File | null) => {
      try {
        // sprawdzanie czy istniejący czat istnieje
        const chat = chats.get(chatId);
        if (!chat) return console.warn("Can't update not existing chat");

        // informacja o rozpoczęciu aktualizacji
        updateStatus({ updatingChat: { isLoading: true, isError: false } });

        // sprawdzanie czy dodać do aktualizacji nazwę czatu
        const updateObject: { name?: string; photoURL?: string } = {};
        if (name && name.length > 3 && name.length < 16) updateObject.name = name;

        // sprawdzanie czy dodać do aktualizacji zdjęcie czatu
        if (typeof photoURL == "string") updateObject.photoURL = photoURL;
        else if (photoURL) {
          const url = await uploadFile(await photoURL.arrayBuffer(), "chats/main", uuidv4());
          updateObject.photoURL = url;
        }

        // referencja czatu do aktualizacji
        const ref = doc(firestore, "chats", chatId);
        await updateDoc(ref, updateObject);

        updateStatus({ updatingChat: { isLoading: false, isError: false } });
      } catch (err) {
        console.warn(err);
        updateStatus({ updatingChat: { isLoading: false, isError: true } });
      }
    },
    [chats],
  );

  /*
    ------- usuwanie czatu na podstawie id  -------
  */

  const deleteChat = useCallback(
    async (chatId: string) => {
      try {
        // sprawdzanie czy istniejący czat istnieje
        const chat = chats.get(chatId);
        if (!chat) return console.warn("Can't delete not existing chat");

        // informacja o rozpoczęciu usuwania
        updateStatus({ deletingChat: { isLoading: true, isError: false } });

        // referencje do chatu i wiadomości
        // [ wiadomości mają taki sam id jak czat! ]
        const chatRef = doc(firestore, "chats", chatId);
        const messagesRef = doc(firestore, "messages", chatId);

        // usuwanie
        await deleteDoc(chatRef);
        await deleteDoc(messagesRef);

        updateStatus({ updatingChat: { isLoading: false, isError: false } });
      } catch (err) {
        console.warn(err);
        updateStatus({ updatingChat: { isLoading: false, isError: true } });
      }
    },
    [chats],
  );

  /*
    ------- DEBUG -------
  */

  // console.log("USER:", formatted.user);
  // console.log("FRIENDS:", formatted.friends);
  // console.log("CHATS:", formatted.chats[0]);
  // console.log("STATUS", status);
  // console.log("USERS", users);

  /*
    ------- ostateczny objekt kontekstu  -------
  */

  const value: ChatContextType = {
    currentUser,
    chats,
    friendsList,
    registeredChatId,
    status,
    addFriend,
    removeFriend,
    sendMessage,
    createChat,
    updateChat,
    deleteChat,
    registerChat,
    formatted,
    utils,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

/*
    -----------------------------
    ------- use Chat Hook -------
    -----------------------------
*/

export const useChat = () => {
  const context = useContext(ChatContext);
  return context!;
};
