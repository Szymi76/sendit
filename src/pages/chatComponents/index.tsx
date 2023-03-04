import { Box } from "@mui/material";

import useToggle from "../../hooks/useToggle";
import { useChat } from "../../providers/ChatProvider";
import Chat from "./Chat";
import ChatsList from "./ChatsList/index";
import CreateNewChat from "./CreateNewChat";

const ChatV2 = () => {
  const [isCreateNewChatVisible, toggleCreateNewChatVisibility] = useToggle();
  const { registeredChatId, chats } = useChat();

  const currentChat = chats.get(registeredChatId ?? "");

  const createNewChat = isCreateNewChatVisible && <CreateNewChat toggleVisibility={toggleCreateNewChatVisibility} />;
  const chat = currentChat && !isCreateNewChatVisible && <Chat />;
  const defaultPage = !isCreateNewChatVisible && !currentChat && <h1>Sendit</h1>;

  return (
    <Box display="flex" paddingLeft={{ xs: "50px", md: 0 }}>
      <ChatsList toggleCreateNewChatVisibility={toggleCreateNewChatVisibility} />
      {createNewChat}
      {chat}
      {defaultPage}
    </Box>
  );
};

export default ChatV2;
