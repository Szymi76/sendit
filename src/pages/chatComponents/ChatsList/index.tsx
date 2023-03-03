import HistoryIcon from "@mui/icons-material/History";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Box, List, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import useToggle from "../../../hooks/useToggle";
import { useChat } from "../../../providers/ChatProvider";
import { ActionsWrapper, Header, HiddenList, SearchInput, SingleListItem, Wrapper } from "./Content";
import { filterChats } from "./utils";

type ChatListProps = { toggleCreateNewChatVisibility: () => void };

const ChatList = ({ toggleCreateNewChatVisibility }: ChatListProps) => {
  const {
    formatted: {
      chats: [chatsArray],
      user,
    },
    registerChat,
  } = useChat();
  const [isListVisible, toggleListVisibility] = useToggle(true);
  const [query, setQuery] = useState("");

  // przefiltrowany chat
  const filteredChats = useMemo(() => filterChats(chatsArray, query), [chatsArray, query]);

  // szerokość wrappera zależna od aktualnej szerokości okna
  const widthOnLarge = isListVisible ? "25%" : "50x";
  const widthOnSmall = isListVisible ? "100%" : "50px";

  return (
    <Wrapper sx={{ width: { xs: widthOnSmall, md: widthOnLarge, minWidth: isListVisible ? "375px" : "0" } }}>
      {/* pokazanie tylko strzałki do pokazania losty */}
      {!isListVisible ? (
        <HiddenList toggleListVisibility={toggleListVisibility} />
      ) : (
        // cała lista wraz ze wszystkimi elementami interakcji
        <>
          <Header
            toggleListVisibility={toggleListVisibility}
            toggleCreateNewChatVisibility={toggleCreateNewChatVisibility}
          />
          <Box position="relative" px={2}>
            <SearchIcon sx={{ position: "absolute", top: "50%", transform: "translate(50%,-50%)" }} />
            <SearchInput
              placeholder="Szukaj tutuaj..."
              inputProps={{ style: { padding: "12px 16px 12px 40px", color: "white" } }}
              onChange={(e) => setQuery(e.target.value)}
            />
          </Box>
          <ActionsWrapper>
            <HistoryIcon />
            <PeopleOutlineIcon />
          </ActionsWrapper>
          {filteredChats.length == 0 ? (
            <Typography variant="subtitle1" p={2}>
              Brak wyników
            </Typography>
          ) : (
            <List>
              {filteredChats.map((chat) => (
                <SingleListItem
                  key={chat.chatId}
                  chat={chat}
                  currentUserUid={user!.uid}
                  onClick={() => registerChat(chat.chatId)}
                />
              ))}
            </List>
          )}
        </>
      )}
    </Wrapper>
  );
};

export default ChatList;
