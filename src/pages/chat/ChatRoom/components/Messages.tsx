import { Box, CircularProgress, styled, Typography } from "@mui/material";
import { useCallback, useMemo } from "react";
import { Virtuoso } from "react-virtuoso";

import { AvatarV2 } from "../../../../components/components";
import useChat from "../../../../hooks/useChat";
import { Message } from "../../../../hooks/useChat/types/client";

const Messages = ({ chatId }: { chatId: string }) => {
  const sendingMessage = useChat((state) => state.sendingMessage);
  const getMessagesWithChatId = useChat((state) => state.getMessagesWithChatId);
  const currentUser = useChat((state) => state.currentUser)!;
  const allMessages = useChat((state) => state.messages);

  const messages = useMemo(() => getMessagesWithChatId(chatId), [allMessages]);
  const messagesArrayIsEmpty = messages.length == 0;
  const triggerMoreMessagesFetch = useCallback(() => useChat.setState({ fetchMoreMessages: true }), []);

  return (
    <Wrapper>
      {messagesArrayIsEmpty && <GrayText mt={3}>Napisz coś aby rozpocząć rozmowę</GrayText>}
      <Virtuoso
        style={{ width: "100%", overflowX: "hidden" }}
        data={messages}
        startReached={triggerMoreMessagesFetch}
        overscan={200}
        itemContent={(index, msg) => <MessageBubble msg={msg} isMy={msg.author!.uid == currentUser.uid} />}
        initialTopMostItemIndex={messages.length - 1}
        firstItemIndex={Math.max(0, 500 - messages.length)}
        followOutput={(isAtBottom) => (isAtBottom ? "smooth" : false)}
      />
      {sendingMessage.isLoading && <Loading />}
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

export const MessageBubble = ({ msg, isMy }: { msg: Message; isMy: boolean }) => {
  const sentAt = msg.createdAt.toDate().toString().substring(16, 21);
  const author = msg.author!;

  return (
    <Box width="100%" display="flex" justifyContent={isMy ? "flex-end" : "flex-start"} p={5}>
      <Box display="flex" flexDirection={isMy ? "row-reverse" : "row"}>
        <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
          <AvatarV2 name={author!.displayName} src={author.photoURL} />
          <Typography variant="subtitle2">{sentAt}</Typography>
        </Box>

        {/* fioletowy lub szary kontener z zawartością wiadomości */}
        <MessageBubbleContentWrapper isMy={isMy}>
          {/* autor */}
          <Typography position="absolute" top={-20} left={5} variant="body2">
            {author.displayName}
          </Typography>
          {/* tekst wiadomości oraz zdjęcia */}
          <Box display="flex" flexDirection="column">
            {msg.files.length > 0 && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={1}>
                {msg.files.map((file, index) => (
                  <ImageInMessage key={index} src={file as string} />
                ))}
              </Box>
            )}
            <Typography
              variant="body1"
              sx={{
                wordWrap: "break-word",
                color: (theme) => {
                  return isMy ? theme.palette.common.white : theme.palette.common.black;
                },
              }}
            >
              {msg.text}
            </Typography>
          </Box>
        </MessageBubbleContentWrapper>
      </Box>
    </Box>
  );
};

export type MessageBubbleContentWrapperProps = { children: React.ReactNode; isMy: boolean };
export const MessageBubbleContentWrapper = ({ children, isMy }: { children: React.ReactNode; isMy: boolean }) => {
  return (
    <Box
      maxWidth="400px"
      position="relative"
      my={7}
      mx={2}
      p={2}
      borderRadius={`8px 8px ${isMy ? "0px" : "8px"} ${isMy ? "8px" : "0px"}`}
      sx={{
        bgcolor: (theme) => {
          return isMy ? theme.palette.primary.main : theme.palette.grey[300];
        },
      }}
    >
      {children}
    </Box>
  );
};

export type ImageInMessageProps = { src: string };
export const ImageInMessage = ({ src }: ImageInMessageProps) => {
  return (
    <img
      src={src}
      height={175}
      width={175}
      style={{ borderRadius: 8, objectFit: "cover", maxWidth: 175, maxHeight: 175 }}
      alt="Zdjęcie"
    />
  );
};

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="flex-end" mr={5} mb={3}>
      <CircularProgress color="primary" />
    </Box>
  );
};
