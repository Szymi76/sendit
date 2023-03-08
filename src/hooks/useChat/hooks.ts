import { shallow } from "zustand/shallow";

import useChat from ".";

export const useCreateNewChat = () => {
  const { currentUser, createChat, friends, creatingChat } = useChat(
    (state) => ({
      currentUser: state.currentUser,
      friends: state.friends,
      createChat: state.createChat,
      creatingChat: state.creatingChat,
    }),
    shallow,
  );

  return { currentUser, createChat, friends, creatingChat };
};

export const useChatList = () => {
  const { currentUser, chats, subscribe, fetchingChats } = useChat(
    (state) => ({
      currentUser: state.currentUser,
      chats: state.chats,
      subscribe: state.subscribe,
      fetchingChats: state.fetchingChats,
    }),
    shallow,
  );

  return { currentUser, chats, subscribe, fetchingChats };
};

export const useChatSettings = () => {
  const { currentChat, subscribe, subscribingTo, updateChat, deleteChat, getChatName } = useChat(
    (state) => ({
      currentChat: state.currentChat,
      subscribe: state.subscribe,
      subscribingTo: state.subscribingTo,
      updateChat: state.updateChat,
      deleteChat: state.deleteChat,
      getChatName: state.getChatName,
    }),
    shallow,
  );

  return { currentChat, subscribe, subscribingTo, updateChat, deleteChat, getChatName };
};

export const _useChat = () => {
  const { currentChat, currentUser, sendMessage, subscribingTo, sendingMessage, chats } = useChat(
    (state) => ({
      currentChat: state.currentChat,
      currentUser: state.currentUser,
      subscribingTo: state.subscribingTo,
      sendMessage: state.sendMessage,
      sendingMessage: state.sendingMessage,
      chats: state.chats,
    }),
    shallow,
  );

  return { currentChat, currentUser, sendMessage, subscribingTo, sendingMessage, chats };
};
