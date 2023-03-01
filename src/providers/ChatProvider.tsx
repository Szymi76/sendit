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
import { Chat, Message, User } from "../firebase/collections";
import useAuth from "../firebase/hooks/useAuth";

const DEFAULT_PHOTO_URL = "https://sendbird.com/main/img/profiles/profile_05_512px.png";

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

export type ChatContextType = {
  currentUser: UserObject | null;
  chats: Map<ChatId, Chat>;
  friendsList: Map<Uid, UserObject>;
  registeredChatId: string | null;
  registerChat: (chatId: ChatId) => Promise<void | null>;
  createChat: (participantsUids: string[], type: ChatType, name?: string) => Promise<null | void>;
  sendMessage: (chatId: ChatId, value: Value) => Promise<void>;
  addFriend: (uid: string) => Promise<void>;
  removeFriend: (uid: string) => Promise<void>;
};

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export type ChatProviderProps = { children: React.ReactNode };

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
    if (!currentUser || !currentUser.val || isLoading || !registeredChatId) return;

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

  const registerChat = async (chatId: ChatId) => {
    const chat = chats.get(chatId);
    if (!chat) return null;

    const ref = doc(firestore, "messages", chatId) as DocumentReference<{ messages: Message[] }>;
    const document = await (await getDoc(ref)).data();
    if (!document) return null;

    const { messages } = document;

    setChats((draft) => {
      draft.set(chatId, { ...chat, messages: { ref, values: messages } });
    });

    setRegisteredChatId(chatId);
  };

  /*
    ------- dodawanie znajomego w czasie rzeczywistym  -------
  */

  const addFriend = async (otherUserUid: string) => {
    if (!user || !currentUser || !currentUser.val || isLoading) return;

    const currentUserRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;
    const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

    const otherUser = await (await getDoc(otherUserRef)).data();
    if (!otherUser) return;

    const newCurrentUserFriendsList = Array.from(new Set([...currentUser.val.friends, otherUserUid]));
    const newOtherUserFriendsList = Array.from(new Set([...otherUser.friends, currentUser.val.uid]));

    await updateDoc(currentUserRef, { friends: newCurrentUserFriendsList });
    await updateDoc(otherUserRef, { friends: newOtherUserFriendsList });
  };

  /*
    ------- usuwanie znajomego w czasie rzeczywistym  -------
  */

  const removeFriend = async (otherUserUid: string) => {
    if (!user || !currentUser || !currentUser.val || isLoading) return;

    const currentUserRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;
    const otherUserRef = doc(firestore, "users", otherUserUid) as DocumentReference<User>;

    const otherUser = await (await getDoc(otherUserRef)).data();
    if (!otherUser) return;

    const newCurrentUserFriendsList = currentUser.val.friends.filter((uid) => uid != otherUserUid);
    const newOtherUserFriendsList = otherUser.friends.filter((uid) => uid != currentUser.val?.uid);

    await updateDoc(currentUserRef, { friends: newCurrentUserFriendsList });
    await updateDoc(otherUserRef, { friends: newOtherUserFriendsList });
  };

  /*
    ------- wysyłanie wiadomości w czasie rzeczywistym  -------
  */

  const sendMessage = async (chatId: ChatId, value: Value) => {
    if (!user || !currentUser || !currentUser.val || !registeredChatId || isLoading) return;

    const ref = doc(firestore, "messages", chatId) as DocumentReference<{ messages: Message[] }>;
    const authorRef = doc(firestore, "users", currentUser.val.uid) as DocumentReference<User>;

    const newMessage: Message = {
      author: { ref: authorRef, val: null },
      text: value.text,
      files: value.files ?? [],
      createdAt: new Timestamp(+new Date() / 1000, 1000),
    };

    const chat = chats.get(registeredChatId);
    if (!chat || !chat.messages.values) return;

    const messages = [...chat.messages.values, newMessage];

    await updateDoc(ref, { messages });
  };

  /*
    ------- tworzenie chatu(pokoju) w czasie rzeczywistym  -------
  */

  const createChat = async (participantsUids: string[], type: ChatType, name?: string) => {
    if (!user || !currentUser || !currentUser.val || isLoading) return null;

    if (!name) name = `Room ${Math.random().toString().substring(3)}`;

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
      photoURL: DEFAULT_PHOTO_URL,
      createdAt: new Timestamp(+new Date() / 1000, 1000),
    };

    const ref = collection(firestore, "chats") as CollectionReference<Chat>;
    const { id } = await addDoc(ref, newChat);

    const messagesRef = doc(firestore, "messages", id) as DocumentReference<{ messages: Message[] }>;
    const chatRef = doc(firestore, "chats", id) as DocumentReference<Chat>;

    await updateDoc(chatRef, { messages: { ref: messagesRef, values: [] } });

    await setDoc(messagesRef, { messages: [] });

    setRegisteredChatId(id);
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
