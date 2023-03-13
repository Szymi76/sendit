import { create } from "zustand";

export type UseStatesType = {
  isChatListVisible: boolean;
  chnageChatListVisibilityTo: (show: boolean) => void;
  isChatSettingsVisible: boolean;
  changeChatSettingsVisibilityTo: (show: boolean) => void;
  isCreateNewChatVisible: boolean;
  changeCreateNewChatVisibilityTo: (show: boolean) => void;
  isUserSettingsVisible: boolean;
  changeUserSettingsVisibility: (show: boolean) => void;
  isSearchDialogVisible: boolean;
  changeSearchDialogVisibility: (show: boolean) => void;
};

export const useStates = create<UseStatesType>()((set, get) => ({
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
}));
