import {
  addDoc,
  collection,
  CollectionReference,
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
import { createContext, useState } from "react";
import { useCallback, useContext, useEffect } from "react";
import { useImmer } from "use-immer";

import { firestore } from "../firebase";
import useAuth from "../firebase/hooks/useAuth";
import { Chat, ChatPretty, Message, User } from "../firebase/types";
import uploadFile from "../firebase/utils/uploadFile";

// const DEFAULT_PHOTO_URL = "https://sendbird.com/main/img/profiles/profile_05_512px.png";

/*
    --------------------------------------
    ------- Types for ChatProvider -------
    --------------------------------------
*/

export type ChatId = string;
export type Uid = string;
export type Value = { text: string; files?: string[] | Blob[] };
export type CreateChatReturn = { chatId: string; chat: Chat } | null;
export type UserObject = { ref: DocumentReference<User>; val: User | null };
export type ChatType = "individual" | "group";

export type ChatsArray = ChatPretty[];
export type ChatsMap = Map<ChatId, ChatPretty>;

export type ChatProviderProps = { children: React.ReactNode };

export type ChatContextType = {
  currentUser: UserObject | null;
  chats: Map<ChatId, Chat>;
  friendsList: Map<Uid, UserObject>;
  registeredChatId: string | null;
  registerChat: (chatId: ChatId) => Promise<void>;
  createChat: (
    participantsUids: string[],
    type: ChatType,
    name: string,
    photoURL?: File | string,
  ) => Promise<{ id: ChatId }>;
  sendMessage: (chatId: ChatId, value: Value) => Promise<void>;
  addFriend: (uid: string) => Promise<void>;
  removeFriend: (uid: string) => Promise<void>;
  formatted: {
    user: () => User | null;
    friends: () => User[];
    chats: () => Readonly<[ChatsArray, ChatsMap]>;
  };
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

const ErrorMessage = "Hook is not ready, probably there is not user logged in.";

// initial values
const initialChatsValue = new Map<ChatId, Chat>();
const initialCurrentUser = null;
const initialFriendsList: Map<Uid, UserObject> = new Map<Uid, UserObject>();

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
  const users: Map<string, UserObject> = new Map();

  console.log("REGISTERED ID", registeredChatId);
  console.log("CHATS", chats);
  console.log("CURRENT USER", currentUser);
  console.log("FRIENDS LIST", friendsList);
  console.log("USERS", users);

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
    return fetchedUser ? fetchedUser : null;
  }, []);

  /*
    ------- pobieranie aktualnego użytkownika z bazy danych w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!user || isLoading) return;

    const ref = doc(firestore, "users", user.uid) as DocumentReference<User>;
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

    currentUser.val.friends.forEach(async (uid) => {
      const ref = doc(firestore, "users", uid) as DocumentReference<User>;
      const friend = await getUserFromArrayOrFirebaseWithUid(uid);

      if (friend) {
        setFriendsList((draft) => {
          draft.set(uid, { ref, val: friend });
        });
      }
    });
  }, [firestore, currentUser]);

  /*
    ------- pobieranie wiadomości zarejestrowanego czatu w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!currentUser || !currentUser.val || isLoading) return;

    if (!registeredChatId) return;

    const ref = doc(firestore, "messages", registeredChatId) as DocumentReference<{ messages: Message[] }>;
    const unsubcribe = onSnapshot(ref, async (snapshot) => {
      const chat = chats.get(registeredChatId);
      const document = snapshot.data();
      if (!document || !chat) return;

      // pobrane wiadomości bez autorów, czyli { ref: <some ref>, val: null }
      const { messages: values } = document;
      const messages = { ref, values };

      // podmienianie wartości autorów które są null na konkretnego użytkownika za pomocą ref-a
      for (let i = 0; i < messages.values.length; i++) {
        const author = messages.values[i].author;
        const userToParse = await getUserFromArrayOrFirebaseWithRef(author.ref);
        messages.values[i].author.val = userToParse;
      }

      setChats((draft) => {
        draft.set(registeredChatId, { ...chat, messages });
      });
    });

    return unsubcribe;
  }, [firestore, user, registeredChatId]);

  /*
    ------- pobieranie wszystkich czatów bez wiadomości w czasie rzeczywistym -------
  */

  useEffect(() => {
    if (!user || !currentUser || isLoading) return;

    const ref = collection(firestore, "chats") as CollectionReference<Chat>;
    const q = query(ref, where("participants", "array-contains", { ref: currentUser.ref, val: null }));
    const unsubcribe = onSnapshot(q, (snapshot) => {
      snapshot.forEach(async (doc) => {
        const chat = doc.data();

        // podmiana uczestników z wartości null na objekt użytkownika
        for (let i = 0; i < chat.participants.length; i++) {
          const ref = chat.participants[i].ref;
          const userToParse = await getUserFromArrayOrFirebaseWithRef(ref);
          chat.participants[i].val = userToParse;
        }

        // ustawianie czatu do mapy, jeśli już istnieje to nie aktualizuje wiadomości
        setChats((draft) => {
          const existingChat = draft.get(doc.id);
          if (!existingChat) draft.set(doc.id, chat);
          else draft.set(doc.id, { ...chat, messages: existingChat.messages });
        });
      });
    });

    return unsubcribe;
  }, [firestore, currentUser, registeredChatId]);

  /*
    ------- pobieranie wiadomości do konkretnego czatu  -------
  */

  const registerChat = useCallback(
    async (chatId: ChatId) => {
      const chat = chats.get(chatId);
      if (!chat) throw new Error("Can't register not exsisting chat");

      const ref = doc(firestore, "messages", chatId) as DocumentReference<{ messages: Message[] }>;
      const document = await (await getDoc(ref)).data();
      if (!document) throw new Error("Chat with provided id does not exists");

      const { messages } = document;

      setChats((draft) => {
        draft.set(chatId, { ...chat, messages: { ref, values: messages } });
      });

      setRegisteredChatId(chatId);
    },
    [chats],
  );

  /*
    ------- dodawanie znajomego w czasie rzeczywistym  -------
  */

  const addFriend = useCallback(
    async (otherUserUid: string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) return;

      const currentUserRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;
      const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

      const otherUser = await (await getDoc(otherUserRef)).data();
      if (!otherUser) throw new Error("Adding user to friend list failed, user does not exsists");

      const newCurrentUserFriendsList = Array.from(new Set([...currentUser.val.friends, otherUserUid]));
      const newOtherUserFriendsList = Array.from(new Set([...otherUser.friends, currentUser.val.uid]));

      await updateDoc(currentUserRef, { friends: newCurrentUserFriendsList });
      await updateDoc(otherUserRef, { friends: newOtherUserFriendsList });
    },
    [currentUser],
  );

  /*
    ------- usuwanie znajomego w czasie rzeczywistym  -------
  */

  const removeFriend = useCallback(
    async (otherUserUid: string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) return;

      const currentUserRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;
      const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

      const otherUser = await (await getDoc(otherUserRef)).data();
      if (!otherUser) throw new Error("Removing user from friend list failed, user does not exsists");

      const newCurrentUserFriendsList = currentUser.val.friends.filter((uid) => uid != otherUserUid);
      const newOtherUserFriendsList = otherUser.friends.filter((uid) => uid != currentUser.val?.uid);

      await updateDoc(currentUserRef, { friends: newCurrentUserFriendsList });
      await updateDoc(otherUserRef, { friends: newOtherUserFriendsList });
    },
    [currentUser],
  );

  /*
    ------- wysyłanie wiadomości w czasie rzeczywistym  -------
  */

  const sendMessage = useCallback(
    async (chatId: ChatId, value: Value) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      const ref = doc(firestore, "messages", chatId) as DocumentReference<{ messages: Message[] }>;
      const authorRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;

      const newMessage: Message = {
        author: { ref: authorRef, val: null },
        text: value.text,
        files: value.files ?? [],
        createdAt: new Timestamp(+new Date() / 1000, 1000),
      };

      const chat = chats.get(chatId);
      if (!chat || !chat.messages.values) throw Error("Chat with provided id is not exsists");

      const messages = [...chat.messages.values, newMessage];

      await updateDoc(ref, { messages });
    },
    [chats, currentUser],
  );

  /*
    ------- tworzenie chatu(pokoju) w czasie rzeczywistym  -------
  */

  const createChat = useCallback(
    async (participantsUids: string[], type: ChatType, name: string, photoURL?: File | string) => {
      if (!user || !currentUser || !currentUser.val || isLoading) throw Error(ErrorMessage);

      const participants: UserObject[] = [];
      participantsUids.forEach((uid) => {
        const ref = doc(firestore, "users", uid) as DocumentReference<User>;
        participants.push({ ref, val: null });
      });

      const tempRef = doc(firestore, "messages", "_temp") as DocumentReference<{ messages: Message[] }>;

      const newChat = {
        participants,
        type,
        messages: { ref: tempRef, values: [] },
        name,
        photoURL: null,
        createdAt: new Timestamp(+new Date() / 1000, 1000),
      };

      const ref = collection(firestore, "chats") as CollectionReference<Chat>;
      const { id } = await addDoc(ref, newChat);

      const messagesRef = doc(firestore, "messages", id) as DocumentReference<{ messages: Message[] }>;
      const chatRef = doc(firestore, "chats", id) as DocumentReference<Chat>;

      if (photoURL && typeof photoURL != "string") {
        const arrayBuffer = await photoURL.arrayBuffer();
        const url = await uploadFile(arrayBuffer, "chats/main", id);
        photoURL = url;
      }

      await updateDoc(chatRef, {
        photoURL: typeof photoURL == "string" ? photoURL : null,
        messages: { ref: messagesRef, values: [] },
      });

      await setDoc(messagesRef, { messages: [] });

      setRegisteredChatId(id);
      return { id };
    },
    [currentUser],
  );

  /*
    ------- objekt z funkcjami do formatowania danych do ładniejszej formy  -------
  */

  const formatted = {
    /**
     * Zwraca dane aktualnie zalogowanego użytkownika z bazy dancyh
     */
    user: useCallback(() => {
      if (!currentUser || !currentUser.val) return null;
      return currentUser.val;
    }, [currentUser]),

    /**
     * Zamienia mapę znajomych na prostą tablice użytkowników
     * @example [firstFriend, secondFriend] as User[];
     */
    friends: useCallback(() => {
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
    chats: useCallback(() => {
      const arrayFromMap = Array.from(chats);
      const array: ChatsArray = arrayFromMap.map(([chatId, chat]) => {
        let messages = chat.messages.values;
        if (!messages) messages = [];

        // @ts-ignore
        const participants: User[] = chat.participants.map(({ ref, val }) => val).filter((user) => user != null);
        return { chatId, ...chat, participants, messages };
      });

      const map: ChatsMap = new Map(array.map((item) => [item.chatId, { ...item }]));

      return [array, map] as const;
    }, [chats]),
  };

  /*
    ------- ostateczny objekt kontekstu  -------
  */

  const value: ChatContextType = {
    currentUser,
    chats,
    friendsList,
    registeredChatId,
    addFriend,
    removeFriend,
    sendMessage,
    createChat,
    registerChat,
    formatted,
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
