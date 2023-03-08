import { create } from "zustand";

import { chatsSlice } from "./slices/chatsSlice";
import { statesSlice } from "./slices/statesSlice";
import { usersSlice } from "./slices/usersSlice";
import { UseChatType } from "./types/slices";

const useChat = create<UseChatType>()((...args) => ({
  ...usersSlice(...args),
  ...chatsSlice(...args),
  ...statesSlice(...args),
}));

export default useChat;
