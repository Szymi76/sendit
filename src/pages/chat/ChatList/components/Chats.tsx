import { List, ListItem, ListItemAvatar, ListItemButton, ListItemText, styled, Typography } from "@mui/material";

import AvatarV2 from "../../../../components/AvatarV2";
import useChat from "../../../../hooks/useChat";
import { Chat } from "../../../../hooks/useChat/types/client";
import { useStates } from "../../states";

const Chats = ({ chats }: { chats: Chat[] }) => {
  if (chats.length == 0) return <NotFoundText>Brak wyników</NotFoundText>;

  return (
    <WrapperAsList>
      {chats.map((chat, index) => (
        <ChatCard key={chat.id} chat={chat} />
      ))}
    </WrapperAsList>
  );
};

export default Chats;

const WrapperAsList = styled(List)(({ theme }) => ({
  overflowY: "auto",
}));

const NotFoundText = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const ChatCard = ({ chat }: { chat: Chat }) => {
  const changeCreateNewChatVisibilityTo = useStates((state) => state.changeCreateNewChatVisibilityTo);
  const getChatName = useChat((state) => state.getChatName);
  const AllMessages = useChat((state) => state.messages);
  const subscribe = useChat((state) => state.subscribe);
  const chatName = getChatName(chat);

  const messages = AllMessages.get(chat.id);
  const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].text : "";

  const handleSelectChat = () => {
    subscribe(chat.id);
    changeCreateNewChatVisibilityTo(false);
  };

  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ py: 2 }} onClick={handleSelectChat}>
        <ListItemAvatar>
          <AvatarV2 src={chat.photoURL} name={chatName} />
        </ListItemAvatar>
        <ListItemText
          primary={chatName}
          secondary={lastMessage}
          secondaryTypographyProps={{ color: (theme) => theme.palette.grey[300], fontSize: 12, noWrap: true }}
        />
      </ListItemButton>
    </ListItem>
  );
};
