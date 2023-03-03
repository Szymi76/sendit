import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Box, Fab, Input, SxProps, Theme, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, useState } from "react";

import { useChat } from "../../../providers/ChatProvider";
import { Header, InputWrapper, MessageBox, MessagesWrapper, Wrapper } from "./Content";

const Chat = () => {
  const [text, setText] = useState("");

  const chatRef = useRef<HTMLDivElement>(null);

  const {
    formatted: {
      chats: [chatsArray, chatsMap],
      user,
    },
    registeredChatId,
    sendMessage,
  } = useChat();

  const chat = useMemo(() => {
    const currentChat = chatsMap.get(registeredChatId!);
    return currentChat!;
  }, [registeredChatId, chatsMap]);

  const handleSendMessage = async () => {
    await sendMessage(chat.chatId, { text });
    setText("");
  };

  // skrolowanie czatu po wysłaniu i odebraniu wiadomości
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 1000);
  }, [chatsArray]);

  // skrolowanie czatu na sam dół po załadowaniu
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 9999);
  }, [chatsArray]);

  return (
    <Wrapper>
      <Header chat={chat} currentUserUid={user!.uid} />

      <MessagesWrapper ref={chatRef} p={3}>
        <Typography sx={{ color: (theme) => theme.palette.grey[600] }} textAlign="center">
          Napisz coś aby rozpocząć rozmowę
        </Typography>

        {chat.messages.map((msg) => (
          <MessageBox key={msg.createdAt.seconds} currentUser={user!} message={msg} />
        ))}
      </MessagesWrapper>

      <InputWrapper py={1} px={3}>
        <Input
          sx={{ width: "100%" }}
          disableUnderline
          placeholder="Napisz wiadomość tutaj..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSendMessage()}
        />
        <Box display="flex" alignItems="center" gap={1}>
          <Fab variant="transparent">
            <SentimentSatisfiedAltIcon />
          </Fab>
          <Fab variant="transparent">
            <AttachFileIcon />
          </Fab>
          <Fab onClick={handleSendMessage} size="medium" color="primary">
            <SendIcon />
          </Fab>
        </Box>
      </InputWrapper>
    </Wrapper>
  );
};

export default Chat;
