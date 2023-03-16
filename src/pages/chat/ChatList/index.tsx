import SearchIcon from "@mui/icons-material/Search";
import { Box, Drawer, Input, styled } from "@mui/material";
import React, { useMemo, useState } from "react";

import { useChat, useStates } from "../../../app/stores";
import { CHAT_LIST_WIDTH, NAV_SPACING } from "../../../constants";
import ChatCard from "./components/ChatCard";
import Chats from "./components/Chats";
import FetchingChats from "./components/FetchingChats";
import FilterActions from "./components/FilterActions";
import { Filter, filterChats } from "./utils";

// LISTA CZATÓW Z INPUTEM I FILTRAMI PO LEWEJ STRONIE
const ChatList = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("recent");
  const chats = useChat((state) => state.chats);
  const fetchingChats = useChat((state) => state.fetchingChats);
  const messages = useChat((state) => state.messages);
  const getChatName = useChat((state) => state.getChatName);
  const subscribe = useChat((state) => state.subscribe);
  const isChatListVisible = useStates((state) => state.isChatListVisible);
  const changeCreateNewChatVisibilityTo = useStates((state) => state.changeCreateNewChatVisibilityTo);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value);
  const changeFilterTo = (arg: Filter) => setFilter(arg);

  // TABLICA CHATÓW PRZECHODZĄCA PRZEZ FUNKCJE DO FILTROWANIA CZATÓW NA PODSTAWIE STATÓW
  const filteredChats = useMemo(() => filterChats(chats, query, messages, filter), [chats, query, filter, messages]);

  // TABLICA JSX Z KARTAMI KAŻDEGO CZATU
  const chatsCards = useMemo(() => {
    return filteredChats.map((chat) => {
      const chatMessages = messages.get(chat.id);
      const chatMessagesIsNotEmpty = Boolean(chatMessages && chatMessages.length > 0);

      const name = getChatName(chat);
      const photo = chat.photoURL;
      const lastMessage = chatMessagesIsNotEmpty ? chatMessages![chatMessages!.length - 1].text : undefined;
      const handleSelect = () => {
        subscribe(chat.id);
        changeCreateNewChatVisibilityTo(false);
      };
      return <ChatCard key={chat.id} name={name} photo={photo} lastMessage={lastMessage} onSelect={handleSelect} />;
    });
  }, [filteredChats]);

  return (
    <Wrapper open={isChatListVisible} anchor="left" variant="persistent">
      <Content>
        <SearchInput
          startAdornment={<SearchIcon />}
          color="secondary"
          placeholder="Szukaj tutaj..."
          onChange={handleQueryChange}
        />
        <FilterActions changeFilterTo={changeFilterTo} />
        {fetchingChats.isLoading ? <FetchingChats /> : <Chats chatsCards={chatsCards} />}
      </Content>
    </Wrapper>
  );
};

export default ChatList;

const Wrapper = styled(Drawer)(({ theme }) => ({
  width: CHAT_LIST_WIDTH,
  maxWidth: "95%",
  "& .MuiDrawer-paper": {
    width: CHAT_LIST_WIDTH,
    maxWidth: "95%",
    boxSizing: "border-box",
  },
}));

const Content = styled(Box)(({ theme }) => ({
  height: "100%",
  marginTop: theme.spacing(NAV_SPACING),
  borderTop: `1px solid rgba(0,0,0,.1)`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: "flex",
  flexDirection: "column",
}));

const SearchInput = styled(Input)(({ theme }) => ({
  padding: theme.spacing(0.75),
  margin: theme.spacing(2),
  backdropFilter: "brightness(120%)",
  color: theme.palette.common.white,
  outline: "none !important",
  borderRadius: "4px",
  overflow: "hidden",
  width: "90%",
}));
