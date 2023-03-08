import { StateCreator } from "zustand";

import { StatesSlice, UseChatType } from "../types/slices";

export const statesSlice: StateCreator<UseChatType, [], [], StatesSlice> = (set, get) => ({
  creatingChat: { isLoading: false, isError: false },
  //
  //
  //
  //
  fetchingChats: { isLoading: false, isError: false },
  //
  //
  //
  //
  sendingMessage: { isLoading: false, isError: false },
  //
  //
  //
  //
  updateStates: (statesToUpdate) => set(statesToUpdate),
});
