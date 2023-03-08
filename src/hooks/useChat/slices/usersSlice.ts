import { arrayRemove, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import produce from "immer";
import { StateCreator } from "zustand";

import { commonError } from "../types/errors";
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
    if (!currentUser) throw new Error(commonError);

    const currentUserRef = refs.users.doc(currentUser.uid);
    const otherUserRef = refs.users.doc(id);

    const otherUser = await getDoc(otherUserRef);
    if (!otherUser.exists()) throw new Error("Can't add or delete user that not exists");

    const isFriend = otherUser.data().friends.includes(currentUser.uid);

    if (!isFriend) {
      await updateDoc(currentUserRef, { friends: arrayUnion(id) });
      await updateDoc(otherUserRef, { friends: arrayUnion(currentUser.uid) });
    } else {
      await updateDoc(currentUserRef, { friends: arrayRemove(id) });
      await updateDoc(otherUserRef, { friends: arrayRemove(currentUser.uid) });
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
  //
  //
  //
  //
  getChatName: (chat) => {
    if (chat.type == "group") return chat.name;

    const otherUser = chat.participants.filter((parti) => parti?.uid != get().currentUser?.uid)[0];
    return otherUser!.displayName;
  },
});
