import { Box } from "@mui/material";

import useToggle from "../../hooks/useToggle";
import { useChat } from "../../providers/ChatProvider";
import Chat from "./Chat";
import ChatsList from "./ChatsList/index";
import CreateNewChat from "./CreateNewChat";

const ChatV2 = () => {
  const [isCreateNewChatVisible, toggleCreateNewChatVisibility] = useToggle();
  const { registeredChatId } = useChat();

  return (
    <Box display="flex" paddingLeft={{ xs: "50px", md: 0 }}>
      <ChatsList toggleCreateNewChatVisibility={toggleCreateNewChatVisibility} />
      {isCreateNewChatVisible ? (
        <CreateNewChat toggleVisibility={toggleCreateNewChatVisibility} />
      ) : registeredChatId ? (
        <Chat />
      ) : (
        <h1>Sendit</h1>
      )}
    </Box>
  );
};

export default ChatV2;
