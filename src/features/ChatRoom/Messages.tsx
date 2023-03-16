import { Box, styled, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

import { useChat } from "../../app/stores";
import { Message } from "../../types/client";
import MessageBubble from "./MessageBubble";
import SendingMessage from "./SendingMessage";

// WSZYSTKIE WIADOMOŚCI CZATU NA PODSTAWIE 'chatId'
const Messages = ({ chatId }: { chatId: string }) => {
  const sendingMessage = useChat((state) => state.sendingMessage);
  const getMessagesWithChatId = useChat((state) => state.getMessagesWithChatId);
  const currentUser = useChat((state) => state.currentUser)!;
  const allMessages = useChat((state) => state.messages);

  const messages = useMemo(() => getMessagesWithChatId(chatId), [allMessages]);
  const messagesArrayIsEmpty = messages.length == 0;
  const triggerFetchForMoreMessages = useCallback(() => useChat.setState({ fetchMoreMessages: true }), []);

  const singleItemContent = (message: Message) => {
    const isMy = message.author!.uid == currentUser.uid;
    return <MessageBubble key={message.id} message={message} isMy={isMy} />;
  };

  return (
    <Wrapper>
      {messagesArrayIsEmpty && <GrayText mt={3}>Napisz coś aby rozpocząć rozmowę</GrayText>}
      <Virtuoso
        style={{ width: "100%", overflowX: "hidden" }}
        data={messages}
        startReached={triggerFetchForMoreMessages}
        overscan={200}
        itemContent={(index, message) => singleItemContent(message)}
        initialTopMostItemIndex={messages.length - 1}
        firstItemIndex={Math.max(0, 500 - messages.length)}
        followOutput={(isAtBottom) => (isAtBottom ? "smooth" : false)}
      />
      {sendingMessage.isLoading && <SendingMessage />}
    </Wrapper>
  );
};

export default Messages;

const Wrapper = styled(Box)(({ theme }) => ({
  flex: 1,
  display: "flex",
  flexDirection: "column",
}));

const GrayText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  textAlign: "center",
}));
