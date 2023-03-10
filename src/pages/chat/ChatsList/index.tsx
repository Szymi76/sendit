import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from "@mui/icons-material/Search";
import { Box, Fab, List, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import { useChatList } from "../../../hooks/useChat/hooks";
import { ChatType } from "../../../hooks/useChat/types/other";
import useToggle from "../../../hooks/useToggle";
import { ActionsWrapper, Header, HiddenList, Loading, SearchInput, SingleListItem, Wrapper } from "./components";
import { Filter, filterChats } from "./utils";

type ChatListProps = { toggleCreateNewChatVisibility: (to: unknown) => void };
const ChatList = ({ toggleCreateNewChatVisibility }: ChatListProps) => {
  const { currentUser, chats, subscribe, fetchingChats } = useChatList();
  const [isListVisible, toggleListVisibility] = useToggle(true);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("recent");

  // przefiltrowany chat
  const filteredChats = useMemo(() => filterChats(chats, query, filter), [chats, query, filter]);

  // rejestrowanie chatu na podstawie id
  const handleListItemClick = async (id: string) => {
    subscribe(id);
    toggleCreateNewChatVisibility(false);
  };

  // szerokość wrappera zależna od aktualnej szerokości okna
  const widthOnLarge = isListVisible ? "25%" : "50x";
  const widthOnSmall = isListVisible ? "100%" : "50px";

  // lista poszczególnych czatów
  // [ brak wrapper -> tablica JSX ]
  const chatsAsJSXArray = useMemo(() => {
    return filteredChats.map((chat) => (
      <SingleListItem key={chat.id} chat={chat} onClick={() => handleListItemClick(chat.id)} />
    ));
  }, [query, chats, filter]);

  // lista znalezionych czatów lub tekst z informacją o braku wyników
  const chatslistOrNotFound =
    filterChats.length == 0 ? (
      <Typography variant="subtitle1" p={2}>
        Brak wyników
      </Typography>
    ) : (
      <List sx={{ overflowY: "auto", overflowX: "hidden" }}>{chatsAsJSXArray}</List>
    );

  return (
    <Wrapper sx={{ width: { xs: widthOnSmall, md: widthOnLarge, minWidth: isListVisible ? "375px" : "0" } }}>
      {/* pokazanie tylko strzałki do pokazania losty */}
      {!isListVisible ? (
        <HiddenList toggleListVisibility={toggleListVisibility} />
      ) : (
        <>
          <Header
            toggleListVisibility={toggleListVisibility}
            toggleCreateNewChatVisibility={toggleCreateNewChatVisibility}
          />

          {/* pole tekstowe */}
          <Box position="relative" px={2}>
            <SearchIcon sx={{ position: "absolute", top: "50%", transform: "translate(50%,-50%)" }} />
            <SearchInput
              placeholder="Szukaj tutuaj..."
              inputProps={{ style: { padding: "12px 16px 12px 40px", color: "white" } }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>

          {/* przyciski pod polem tekstowym */}
          <ActionsWrapper>
            <Fab variant="transparent" color="secondary" size="small" onClick={() => setFilter("recent")}>
              <HistoryIcon />
            </Fab>
            <Fab variant="transparent" color="secondary" size="small" onClick={() => setFilter("individual")}>
              <PersonIcon />
            </Fab>
            <Fab variant="transparent" color="secondary" size="small" onClick={() => setFilter("group")}>
              <GroupsIcon />
            </Fab>
          </ActionsWrapper>

          {/* informacja o ładowaniu lub pokazanie listy czatów */}
          {fetchingChats.isLoading ? <Loading /> : chatslistOrNotFound}
        </>
      )}
    </Wrapper>
  );
};

export default ChatList;
