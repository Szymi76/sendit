import { create } from "zustand";

import { UseChatType, UseStatesType } from "../types/stores";
import { createChatsSlice } from "./slices/chatsSlice";
import { createStatesSlice } from "./slices/statesSlice";
import { createStatusesSlice } from "./slices/statusesSlice";
import { createUsersSlice } from "./slices/usersSlice";

export const useChat = create<UseChatType>()((...args) => ({
  ...createUsersSlice(...args),
  ...createChatsSlice(...args),
  ...createStatusesSlice(...args),
}));

export const useStates = create<UseStatesType>()((...args) => ({
  ...createStatesSlice(...args),
}));
