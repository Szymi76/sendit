import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Box, Fab, Grid, Input, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EmojiPicker from "emoji-picker-react";
import { useEffect, useMemo, useRef, useState } from "react";

import useToggle from "../../../hooks/useToggle";
import { useChat } from "../../../providers/ChatProvider";
import {
  EmojiWrapper,
  FileItem,
  FilesPreviewWrapper,
  Header,
  InputWrapper,
  MessageBox,
  MessagesWrapper,
  Wrapper,
} from "./Content";

const Chat = () => {
  const [text, setText] = useState("");
  const [isEmojisVisible, toggleEmojisVisibility] = useToggle();
  const [files, setFiles] = useState<File[]>([]);

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
    await sendMessage(chat.chatId, { text, files });
    setText("");
    setFiles([]);
  };

  // skrolowanie czatu po wysłaniu i odebraniu wiadomości
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 1000);
  }, [chatsArray]);

  // skrolowanie czatu na sam dół po załadowaniu
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 9999);
  }, [chatsArray]);

  const messages = useMemo(() => {
    return chat.messages.map((msg, i) => {
      const key = `${msg.createdAt.seconds}-${i}-${msg.text.slice(0, 5)}`;
      return <MessageBox key={key} currentUser={user!} message={msg} />;
    });
  }, [chatsArray]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length > 4) return console.warn("Too many files, max 4 avaiable");
    setFiles(Array.from(files));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((files) => files.filter((file, i) => i != index));
  };

  return (
    <Wrapper>
      <Header chat={chat} currentUserUid={user!.uid} />
      <MessagesWrapper ref={chatRef} p={3}>
        <Typography sx={{ color: (theme) => theme.palette.grey[600] }} textAlign="center">
          Napisz coś aby rozpocząć rozmowę
        </Typography>
        {messages}
      </MessagesWrapper>
      <InputWrapper position="relative" py={1} px={3}>
        <Input
          sx={{ width: "100%" }}
          disableUnderline
          placeholder="Napisz wiadomość tutaj..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSendMessage()}
        />
        <Box position="relative" display="flex" alignItems="center" gap={1}>
          <Fab variant="transparent" onClick={toggleEmojisVisibility}>
            <SentimentSatisfiedAltIcon />
          </Fab>
          <Fab variant="transparent">
            <IconButton hidden component="label">
              <AttachFileIcon />
              <input type="file" multiple hidden onChange={handleFileChange} />
            </IconButton>
          </Fab>
          <Fab onClick={handleSendMessage} size="medium" color="primary">
            <SendIcon />
          </Fab>
          {isEmojisVisible && (
            <EmojiWrapper toggleEmojisVisibility={toggleEmojisVisibility}>
              <EmojiPicker
                onEmojiClick={(emoji) => {
                  setText(text + emoji.emoji);
                  console.log(emoji);
                }}
                width="100%"
              />
            </EmojiWrapper>
          )}
        </Box>
        {files.length > 0 && (
          <FilesPreviewWrapper container rowSpacing={1} columnSpacing={1}>
            {files.map((file, index) => (
              <FileItem key={index} file={file} single={files.length == 1} onRemove={() => handleRemoveFile(index)} />
            ))}
          </FilesPreviewWrapper>
        )}
      </InputWrapper>
    </Wrapper>
  );
};

export default Chat;
