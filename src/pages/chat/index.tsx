import { Box } from "@mui/material";

import useChat from "../../hooks/useChat/index";
import { ChatsProvider } from "../../hooks/useChat/providers/ChatsProvider";
import { CurrentUserProvider } from "../../hooks/useChat/providers/CurrentUserProvider";
import { FriendsProvider } from "../../hooks/useChat/providers/FriendsProvider";
import { MessagesProvider } from "../../hooks/useChat/providers/MessagesProvider";
import { SubscriptionProvider } from "../../hooks/useChat/providers/SubscriptionProvider";
import useToggle from "../../hooks/useToggle";
import Chat from "./Chat";
import ChatsList from "./ChatsList";
import CreateNewChat from "./CreateNewChat";
import Default from "./Default";

const ChatV3 = () => {
  const [isCreateNewChatVisible, toggleCreateNewChatVisibility] = useToggle();
  const currentChat = useChat((state) => state.currentChat);

  const createNewChat = isCreateNewChatVisible && <CreateNewChat toggleVisibility={toggleCreateNewChatVisibility} />;
  const chat = currentChat && !isCreateNewChatVisible && <Chat />;
  const defaultPage = !isCreateNewChatVisible && !currentChat && <Default />;

  return (
    <CurrentUserProvider>
      <FriendsProvider>
        <ChatsProvider>
          <MessagesProvider>
            <SubscriptionProvider>
              <Box display="flex" paddingLeft={{ xs: "50px", md: 0 }}>
                <ChatsList toggleCreateNewChatVisibility={toggleCreateNewChatVisibility} />
                {createNewChat}
                {chat}
                {defaultPage}
              </Box>
            </SubscriptionProvider>
          </MessagesProvider>
        </ChatsProvider>
      </FriendsProvider>
    </CurrentUserProvider>
  );
};

export default ChatV3;
