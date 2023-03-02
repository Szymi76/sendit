import React from "react";
import useToggle from "../../hooks/useToggle";
import ChatsList from "./ChatsList/index";
import CreateNewChat from "./CreateNewChat";
import { Box } from "@mui/material";

const ChatV2 = () => {
  const [isCreateNewChatVisible, toggleCreateNewChatVisibility] = useToggle();

  return (
    <Box display="flex">
      <ChatsList toggleCreateNewChatVisibility={toggleCreateNewChatVisibility} />
      {isCreateNewChatVisible && <CreateNewChat toggleVisibility={toggleCreateNewChatVisibility} />}
    </Box>
  );
};

export default ChatV2;
