import { create } from "zustand";

export type UseStatesType = {
  isChatListVisible: boolean;
  chnageChatListVisibilityTo: (show: boolean) => void;
  isChatSettingsVisible: boolean;
  changeChatSettingsVisibilityTo: (show: boolean) => void;
  isCreateNewChatVisible: boolean;
  changeCreateNewChatVisibilityTo: (show: boolean) => void;
};

export const useStates = create<UseStatesType>()((set, get) => ({
  isChatListVisible: true,
  isChatSettingsVisible: false,
  isCreateNewChatVisible: false,
  chnageChatListVisibilityTo: (show) => set({ isChatListVisible: show }),
  changeChatSettingsVisibilityTo: (show) => set({ isChatSettingsVisible: show }),
  changeCreateNewChatVisibilityTo: (show) => set({ isCreateNewChatVisible: show }),
}));
