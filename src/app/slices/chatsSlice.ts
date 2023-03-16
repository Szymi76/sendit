import { uuidv4 } from "@firebase/util";
import { addDoc, deleteDoc, DocumentReference, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import produce from "immer";
import { StateCreator } from "zustand";

import refs from "../../firebase/utils/refs";
import uploadFile from "../../firebase/utils/uploadFile";
import { db_Chat, db_Message, db_User } from "../../types/database";
import { ChatRole } from "../../types/other";
import { ChatsSlice } from "../../types/slices";
import { UseChatType } from "../../types/stores";

export const createChatsSlice: StateCreator<UseChatType, [], [], ChatsSlice> = (set, get) => ({
  chats: [],
  //
  //
  //
  //
  currentChat: null,
  //
  //
  //
  //
  subscribingTo: null,
  //
  //
  //
  //
  subscriptionInQueue: null,
  //
  //
  //
  //
  fetchMoreMessages: false,
  //
  //
  //
  //
  messages: new Map(),
  //
  //
  //
  //
  subscribe: (id) => set({ subscribingTo: id }),
  //
  //
  //
  //
  subscribeQueue: (id) => set({ subscriptionInQueue: id }),
  //
  //
  //
  //
  getChatById: (id) => {
    const index = get().chats.findIndex((chat) => chat.id == id);
    if (index < 0) return null;
    return get().chats[index];
  },
  //
  //
  //
  //
  createChat: async (ids, type, name, photo) => {
    const currentUser = get().currentUser!;

    const participants = ids.map((id) => {
      const role: ChatRole = id == currentUser.uid ? "owner" : "user";
      return { userRef: refs.users.doc(id), role };
    });

    const newChat: db_Chat = {
      participants,
      participantsUids: ids,
      type,
      name,
      photoURL: null,
      messages: null,
      createdAt: new Timestamp(+new Date() / 1000, 1000),
    };

    // informacja o rozpoczęciu tworzenia czatu
    get().updateStatuses({ creatingChat: { isLoading: true, isError: false } });

    const { id } = await addDoc(refs.chats.col, newChat);

    // aktualizacja zdjęcia czatu, jeśli zostało podane jako parametr
    if (photo && typeof photo != "string") {
      const arrayBuffer = await photo.arrayBuffer();
      const url = await uploadFile(arrayBuffer, "chats/main", id);
      photo = url;
    }

    // aktualizacja referencji wiadomości i zdjęcia czatu
    await updateDoc(refs.chats.doc(id), {
      photoURL: typeof photo == "string" ? photo : null,
    });

    get().subscribeQueue(id);

    return id;
  },
  //
  //
  //
  //
  updateChat: async (chatId, { newName, newPhoto, newParticipants }) => {
    const chat = get().getChatById(chatId);
    const currentUser = get().currentUser;
    if (!chat || !currentUser) throw new Error("Can't update not existing chat or user in not logged in");

    // sprawdzanie czy dodać do aktualizacji nazwę czatu
    const updateObject: {
      name?: string;
      photoURL?: string;
      participants?: { userRef: DocumentReference<db_User>; role: ChatRole }[];
      participantsUids?: string[];
    } = {};
    if (newName && newName.length > 3 && newName.length < 16) updateObject.name = newName;

    // sprawdzanie czy dodać do aktualizacji zdjęcie czatu
    if (typeof newPhoto == "string") updateObject.photoURL = newPhoto;
    else if (newPhoto) {
      const url = await uploadFile(await newPhoto.arrayBuffer(), "chats/main", uuidv4());
      updateObject.photoURL = url;
    }

    // sprawdzanie czy do aktualizacji dodać nowych uczestników

    // sprawdzanie czy:
    // - aktualnie zalogowany użytkownik ma prawo do zmiany uczestników
    // - właściciel nie opuszcza czatu
    // - właściciel nie został zmieniony
    if (newParticipants) {
      const currentUserRole = get().getUserRole(currentUser.uid, chatId);
      // if (currentUserRole == "user") throw new Error("You don't have permission to chnage participants");
      if (!newParticipants.some((user) => user.role == "owner")) throw new Error("You can't leave chat as owner");
      const primaryOwner = chat.participants.find((user) => user.role == "owner")!;
      const newOwner = newParticipants.find((user) => user.role == "owner")!;
      if (primaryOwner.uid != newOwner.uid) throw new Error("Owner can't be changed");

      const participants = newParticipants.map((user) => {
        return { userRef: refs.users.doc(user.uid), role: user.role };
      });
      updateObject.participants = participants;
      updateObject.participantsUids = newParticipants.map((p) => p.uid);
    }

    await updateDoc(refs.chats.doc(chatId), updateObject);
  },
  //
  //
  //
  //
  deleteChat: async (chatId) => {
    const chat = get().getChatById(chatId);

    if (!chat) throw new Error("Can't delete not existing chat");

    await deleteDoc(refs.chats.doc(chatId));
    get().subscribe(null);

    const messages = await getDocs(refs.messages.col(chatId));

    for (let i = 0; i < messages.docs.length; i++) {
      const doc = messages.docs[i];
      await deleteDoc(doc.ref);
    }
  },
  //
  //
  //
  //
  sendMessage: async (chatId, text, files) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error("Can't send message as not logged in user");

    // informacja o rozpoczęciu wysyłania
    get().updateStatuses({ sendingMessage: { isLoading: true, isError: false } });

    const filesUrls: string[] = [];
    if (files) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (typeof file == "string") filesUrls.push(file);
        else {
          const filename = uuidv4();
          const url = await uploadFile(await file.arrayBuffer(), "chats/files", filename);
          filesUrls.push(url);
        }
      }
    }

    const newMessage: db_Message = {
      author: refs.users.doc(currentUser.uid),
      text,
      files: filesUrls,
      createdAt: new Timestamp(+new Date() / 1000, 1000),
    };

    // dodawanie wiadomości do kolekcji
    await addDoc(refs.messages.col(chatId), newMessage);

    // informacja o zakończeniu wysyłania
    get().updateStatuses({ sendingMessage: { isLoading: false, isError: false } });
  },
  //
  //
  //
  //
  getMessagesWithChatId: (chatId) => {
    const messages = get().messages.get(chatId);
    return messages ? messages : [];
  },
  //
  //
  //
  //
  mergeMessages: (chatId, ...messages) => {
    set(
      produce<UseChatType>((state) => {
        const array = get().messages.get(chatId) ?? [];
        const allMessages = [...array, ...messages];
        const idsWithDuplicates = allMessages.map((msg) => msg.id);
        const ids = Array.from(new Set(idsWithDuplicates));

        const messagesArray = ids.map((id) => allMessages.find((msg) => msg.id == id)!);

        const sortedMessages = messagesArray.sort((a, b) => +b.createdAt.toDate() - +a.createdAt.toDate());
        state.messages.set(chatId, sortedMessages.reverse());
      }),
    );
  },
  //
  //
  //
  //
  getUserRole: (uid, chatId, defaultRole = "user") => {
    const chat = get().getChatById(chatId);

    if (!chat) return "user";

    const user = chat.participants.find((user) => user.uid == uid);

    if (!user) return defaultRole;
    return user.role;
  },
  //
  //
  //
  //
  getChatName: (chat) => {
    if (chat.type == "group") return chat.name;

    const otherUser = chat.participants.filter((parti) => parti?.uid != get().currentUser?.uid)[0];
    return otherUser ? otherUser.displayName : chat.name;
  },
  //
  //
  //
  //
  getChatPhoto: (chat) => {
    if (chat.type == "group") return chat.photoURL;

    const otherUser = chat.participants.filter((parti) => parti?.uid != get().currentUser?.uid)[0];
    return otherUser ? otherUser.photoURL : chat.photoURL;
  },
});
