import { Box, styled } from "@mui/material";

import useChat from "../../hooks/useChat";
import ChatList from "./ChatList";
import ChatRoom from "./ChatRoom";
import ChatSettings from "./ChatSettings";
import { CHAT_LIST_WIDTH } from "./constants";
import CreateNewChat from "./CreateNewChat";
import ChatNav from "./Nav";
import Search from "./Search";
import Settings from "./Settings";
import { useStates } from "./states";

const Chat = () => {
  const isChatListVisible = useStates((state) => state.isChatListVisible);
  const isCreateNewChatVisible = useStates((state) => state.isCreateNewChatVisible);
  const currentChat = useChat((state) => state.currentChat);
  const currentUser = useChat((state) => state.currentUser);

  const showChatRoom = !isCreateNewChatVisible && currentChat;

  console.log(useChat());

  return (
    <Wrapper>
      <ChatNav />
      <Main open={isChatListVisible}>
        <ChatList />
        <Content>{showChatRoom ? <ChatRoom /> : <CreateNewChat />}</Content>
        {showChatRoom && <ChatSettings />}
      </Main>
      {currentUser && <Settings />}
      {currentUser && <Search />}
    </Wrapper>
  );
};

export default Chat;

const Wrapper = styled(Box)(({ theme }) => ({
  height: "100vh",
  width: "100%",
  display: "flex",
  flexDirection: "column",
}));

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })<{
  open?: boolean;
}>(({ theme, open }) => ({
  display: "flex",
  flexGrow: 1,
  transition: theme.transitions.create("margin", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: `-${CHAT_LIST_WIDTH}px`,
  ...(open && {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    [theme.breakpoints.up("md")]: {
      marginLeft: 0,
    },
    [theme.breakpoints.down("md")]: {
      marginLeft: `-${CHAT_LIST_WIDTH}px`,
    },
  }),
}));

const Content = styled(Box)(({ theme }) => ({
  height: "100%",
  width: "100%",
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[100],
}));
