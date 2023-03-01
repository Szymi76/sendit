import HistoryIcon from "@mui/icons-material/History";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/material";
import { useMemo, useState } from "react";

import useToggle from "../../../hooks/useToggle";
import { useChat } from "../../../providers/ChatProvider";
import { ActionsWrapper, CardsWrapper, ChatCard, Header, HiddenList, SearchInput, Wrapper } from "./Content";
import { filterChats } from "./utils";

const ChatList = () => {
  const { chats, currentUser, friendsList } = useChat();
  const [isListVisible, toggleListVisibility] = useToggle(true);
  const [query, setQuery] = useState("");

  // znajomi w postaci tablicy
  const friendsListAsArray = Array.from(friendsList).map(([id, user]) => user.val?.displayName);

  // przefiltrowany chat
  const filteredChat = useMemo(() => filterChats(chats, query, currentUser), [chats, query]);

  // tablica JSX zawirająca wszystkie pokoje w których uczestniczy aktualny użytkownik
  const chatRoomsList = Array.from(filteredChat).map(([id, chat]) => {
    if (!currentUser || !currentUser.val) return <></>;

    const participantsWithoutMe = chat.participants.filter((p) => p.val?.uid != currentUser.val?.uid);
    const name = chat.type == "individual" ? participantsWithoutMe[0].val?.displayName : chat.name;
    const photoURL = chat.type == "individual" ? participantsWithoutMe[0].val?.photoURL : chat.photoURL;

    if (!name || !photoURL) return <></>;

    return <ChatCard key={id} name={name} photoURL={photoURL} />;
  });

  // szerokość wrappera zależna od aktualnej szerokości okna
  const widthOnLarge = isListVisible ? "25%" : "65px";
  const widthOnSmall = isListVisible ? "100%" : "65px";

  return (
    <Wrapper sx={{ width: { xs: widthOnSmall, md: widthOnLarge } }}>
      {/* pokazanie tylko strzałki do pokazania losty */}
      {!isListVisible ? (
        <HiddenList toggleListVisibility={toggleListVisibility} />
      ) : (
        // cała lista wraz ze wszystkimi elementami interakcji
        <>
          <Header toggleListVisibility={toggleListVisibility} />
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
          <CardsWrapper>{chatRoomsList}</CardsWrapper>
        </>
      )}
    </Wrapper>
  );
};

export default ChatList;
