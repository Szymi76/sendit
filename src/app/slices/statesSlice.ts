import { StateCreator } from "zustand";

import { StatesSlice } from "../../types/slices";
import { UseStatesType } from "../../types/stores";

export const createStatesSlice: StateCreator<UseStatesType, [], [], StatesSlice> = (set, get) => ({
  isChatListVisible: true,
  isChatSettingsVisible: false,
  isCreateNewChatVisible: false,
  isUserSettingsVisible: false,
  isSearchDialogVisible: false,
  chnageChatListVisibilityTo: (show) => set({ isChatListVisible: show }),
  changeChatSettingsVisibilityTo: (show) => set({ isChatSettingsVisible: show }),
  changeCreateNewChatVisibilityTo: (show) => set({ isCreateNewChatVisible: show }),
  changeUserSettingsVisibility: (show) => set({ isUserSettingsVisible: show }),
  changeSearchDialogVisibility: (show) => set({ isSearchDialogVisible: show }),
});
