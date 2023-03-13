import { uuidv4 } from "@firebase/util";
import { addDoc, deleteDoc, getDocs, Timestamp, updateDoc } from "firebase/firestore";
import produce from "immer";
import { StateCreator } from "zustand";

import uploadFile from "../../../firebase/utils/uploadFile";
import { db_Chat, db_Message } from "../types/database";
import { ChatRolesArray } from "../types/other";
import { ChatsSlice, UseChatType } from "../types/slices";
import refs from "../utils/refs";

export const chatsSlice: StateCreator<UseChatType, [], [], ChatsSlice> = (set, get) => ({
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

    const roles: ChatRolesArray = ids.map((id) => {
      return { uid: id, role: currentUser.uid == id ? "owner" : "user" };
    });

    const newChat: db_Chat = {
      participants: ids.map((uid) => refs.users.doc(uid)),
      participantsIdsAsString: ids.join(","),
      roles,
      type,
      name,
      photoURL: null,
      messages: null,
      createdAt: new Timestamp(+new Date() / 1000, 1000),
    };

    // informacja o rozpoczęciu tworzenia czatu
    get().updateStates({ creatingChat: { isLoading: true, isError: false } });

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
  },
  //
  //
  //
  //
  updateChat: async (chatId, name, photo) => {
    const chat = get().getChatById(chatId);

    if (!chat) throw new Error("Can't update not existing chat");

    // sprawdzanie czy dodać do aktualizacji nazwę czatu
    const updateObject: { name?: string; photoURL?: string } = {};
    if (name && name.length > 3 && name.length < 16) updateObject.name = name;

    // sprawdzanie czy dodać do aktualizacji zdjęcie czatu
    if (typeof photo == "string") updateObject.photoURL = photo;
    else if (photo) {
      const url = await uploadFile(await photo.arrayBuffer(), "chats/main", uuidv4());
      updateObject.photoURL = url;
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
    get().updateStates({ sendingMessage: { isLoading: true, isError: false } });

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
    get().updateStates({ sendingMessage: { isLoading: false, isError: false } });
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
  messages: new Map(),
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
  changeChatRoles: async (chatId, newRolesArray) => {
    const chat = get().getChatById(chatId);

    if (!chat) throw new Error("Can't change roles to not existing chat");

    const currentUser = get().currentUser!;
    const currentUserRole = get().getUserRole(currentUser.uid, chatId);
    if (currentUserRole != "owner") throw new Error("Only owner can change roles");

    const roles = chat.roles;
    const isMoreThenOneOwner = roles.filter((item) => item.role == "owner").length > 1;
    const owner = roles.find((item) => item.role == "owner");
    const newOwner = newRolesArray.find((item) => item.role == "owner");
    const isOwnerHaveBeenChanged = owner && newOwner && owner.uid != newOwner.uid;

    if (isMoreThenOneOwner || isOwnerHaveBeenChanged)
      throw new Error("Owner have been changed or there is more then one");

    const chatRef = refs.chats.doc(chat.id);
    await updateDoc(chatRef, { roles: newRolesArray });
  },
  //
  //
  //
  //
  getUserRole: (uid, chatId, defaultRole = "user") => {
    const chat = get().getChatById(chatId);

    if (!chat) throw new Error("Can't get user role from not existing chat");

    const user = chat.roles.find((val) => val.uid == uid);

    if (!user) return defaultRole;
    return user.role;
  },
});
