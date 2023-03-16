import { ChatsSlice, StatesSlice, StatusesSlice, UsersSlice } from "./slices";

export type UseChatType = UsersSlice & ChatsSlice & StatusesSlice;

export type UseStatesType = StatesSlice;
