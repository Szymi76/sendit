import { arrayRemove, arrayUnion, getDoc, getDocs, query, updateDoc, where } from "firebase/firestore";
import produce from "immer";
import { StateCreator } from "zustand";

import { UseChatType, UsersSlice } from "../types/slices";
import { fetchUserById } from "../utils/fetchers";
import refs from "../utils/refs";

export const usersSlice: StateCreator<UseChatType, [], [], UsersSlice> = (set, get) => ({
  //
  //
  //
  //
  currentUser: null,
  //
  //
  //
  //
  friends: [],
  //
  //
  //
  //
  users: [],
  //
  //
  //
  //
  toggleUserAsFriend: async (id) => {
    const currentUser = get().currentUser;
    if (!currentUser) throw new Error("Can't add or delete friend when you are not logged in");

    if (currentUser.uid == id) throw new Error("Can't add yourself as friend");

    const currentUserRef = refs.users.doc(currentUser.uid);
    const otherUserRef = refs.users.doc(id);

    const otherUser = await getDoc(otherUserRef);
    if (!otherUser.exists()) throw new Error("Can't add or delete user that not exists");

    const isFriend = otherUser.data().friendsUids.includes(currentUser.uid);

    if (!isFriend) {
      await updateDoc(currentUserRef, { friendsUids: arrayUnion(id) });
      await updateDoc(otherUserRef, { friendsUids: arrayUnion(currentUser.uid) });
    } else {
      await updateDoc(currentUserRef, { friendsUids: arrayRemove(id) });
      await updateDoc(otherUserRef, { friendsUids: arrayRemove(currentUser.uid) });
    }

    const allCurrentUserChatsPromises = currentUser.chatsIds.map((id) => getDoc(refs.chats.doc(id)));
    const allCurrentUserChats = await Promise.all(allCurrentUserChatsPromises);
    const isIndividualChatExists = allCurrentUserChats.some((document) => {
      const chat = document.data();
      if (!chat) return false;
      const isCurrentUserIn = chat.participants.some((p) => p.userRef.id == currentUser.uid);
      const isOtherUserIn = chat.participants.some((p) => p.userRef.id == id);
      const isChatHaveTwoUsers = chat.participants.length == 2;
      const isChatIndividual = chat.type == "individual";
      return isCurrentUserIn && isOtherUserIn && isChatHaveTwoUsers && isChatIndividual;
    });

    if (!isIndividualChatExists) {
      const chatId = await get().createChat([currentUser.uid, id], "individual", otherUser.data().displayName);
      await updateDoc(currentUserRef, { chatsIds: arrayUnion(chatId) });
      await updateDoc(otherUserRef, { chatsIds: arrayUnion(chatId) });
    }
  },
  //
  //
  //
  //
  getUserById: async (id) => {
    const index = get().users.findIndex((user) => user.uid == id);
    if (!get().users[index]) {
      const user = await fetchUserById(id);
      if (user)
        set(
          produce<UseChatType>((state) => {
            state.users.push(user);
          }),
        );
      return user;
    }

    return get().users[index];
  },
});
