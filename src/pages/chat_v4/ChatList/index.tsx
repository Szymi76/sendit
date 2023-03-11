import { Box, CircularProgress, Drawer, styled, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";

import useChat from "../../../hooks/useChat";
import { CHAT_LIST_WIDTH, NAV_SPACING } from "../constants";
import { useStates } from "../states";
import Chats from "./components/Chats";
import FilterActions from "./components/FilterActions";
import SearchTextField from "./components/SearchTextField";
import { Filter, filterChats } from "./utils";

const ChatList = () => {
  const [query, setQuery] = useState("");
  const [initialSet, setInitialSet] = useState(false);
  const [filter, setFilter] = useState<Filter>("recent");
  const chats = useChat((state) => state.chats);
  const isChatListVisible = useStates((state) => state.isChatListVisible);
  const fetchingChats = useChat((state) => state.fetchingChats);
  const subscribe = useChat((state) => state.subscribe);

  const handleQueryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => setQuery(e.target.value);
  const changeFilterTo = (arg: Filter) => setFilter(arg);

  const filteredChats = useMemo(() => filterChats(chats, query, filter), [chats, query, filter]);

  useEffect(() => {
    if (!initialSet && chats.length > 0) {
      subscribe(chats[0].id);
      setInitialSet(true);
    }
  }, [chats]);

  return (
    <Wrapper open={isChatListVisible} anchor="left" variant="persistent">
      <Content>
        <SearchTextField placeholder="Szukaj tutaj..." onChange={handleQueryChange} />
        <FilterActions changeFilterTo={changeFilterTo} />
        {fetchingChats.isLoading ? <Loading /> : <Chats chats={filteredChats} />}
      </Content>
    </Wrapper>
  );
};

export default ChatList;

export const Wrapper = styled(Drawer)(({ theme }) => ({
  width: CHAT_LIST_WIDTH,
  maxWidth: "95%",
  "& .MuiDrawer-paper": {
    width: CHAT_LIST_WIDTH,
    maxWidth: "95%",
    boxSizing: "border-box",
  },
}));

export const Content = styled(Box)(({ theme }) => ({
  height: "100%",
  marginTop: theme.spacing(NAV_SPACING),
  borderTop: `1px solid rgba(0,0,0,.1)`,
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.common.white,
  display: "flex",
  flexDirection: "column",
}));

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="center" mt={3}>
      <CircularProgress color="secondary" />
    </Box>
  );
};
