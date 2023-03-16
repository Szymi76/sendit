import { StateCreator } from "zustand";

import { StatusesSlice } from "../../types/slices";
import { UseChatType } from "../../types/stores";

export const createStatusesSlice: StateCreator<UseChatType, [], [], StatusesSlice> = (set, get) => ({
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
  updateStatuses: (statesToUpdate) => set(statesToUpdate),
});
