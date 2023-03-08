import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, Fab, Input, Typography } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { RotatingLines } from "react-loader-spinner";

import { _useChat } from "../../../hooks/useChat/hooks";
import useToggle from "../../../hooks/useToggle";
import ChatSettings from "../ChatSettings";
import {
  EmojiWrapper,
  FileItem,
  FilesPreviewWrapper,
  GrayText,
  Header,
  InputWrapper,
  MessageBox,
  MessagesWrapper,
  Wrapper,
} from "./components";

const Chat = () => {
  const [text, setText] = useState("");
  const [isEmojisVisible, toggleEmojisVisibility] = useToggle();
  const [areSettingsVisible, toggleSettingsVisibility] = useToggle();
  const [files, setFiles] = useState<File[]>([]);

  const chatRef = useRef<HTMLDivElement>(null);

  const { currentChat, currentUser, sendMessage, sendingMessage, subscribingTo, chats } = _useChat();

  // aktualnie zarejestrowany czat
  const chat = chats.find((chat) => chat.id == subscribingTo)!;

  // wysyałanie wiadomości
  const handleSendMessage = async () => {
    if (text.trim().length == 0 && files.length == 0) return;
    await sendMessage(chat.id, text, files);
    setText("");
    setFiles([]);
  };

  // skrolowanie czatu po wysłaniu i odebraniu wiadomości
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 1000);
  }, [chats, sendingMessage.isLoading]);

  // skrolowanie czatu na sam dół po załadowaniu
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollBy(0, 9999);
  }, [chats, subscribingTo]);

  // wiadomości jako tablica JSX.Element
  const messages = useMemo(() => {
    return chat.messages.map((msg, i) => {
      const key = `${msg.createdAt.seconds}-${i}-${msg.text.slice(0, 5)}`;
      return <MessageBox key={key} currentUser={currentUser!} message={msg} />;
    });
  }, [chats, subscribingTo]);

  // dodawanie plików
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length > 4) return console.warn("Too many files, max 4 avaiable");
    setFiles(Array.from(files));
  };

  // usuwanie pliku na podstawie indexu
  const handleRemoveFile = (index: number) => {
    setFiles((files) => files.filter((file, i) => i != index));
  };

  // dodawanie emotek do tekstu
  const handleEmojiClick = (emojiData: EmojiClickData) => setText(text + emojiData.emoji);

  return (
    <Wrapper>
      <Header chat={chat} currentUserUid={currentUser!.uid}>
        <Fab variant="transparent" onClick={toggleSettingsVisibility}>
          <SettingsIcon />
        </Fab>
        {false && (
          <Box width="100%" position="absolute" display="flex" justifyContent="center" bottom={-100}>
            <RotatingLines width="36" strokeColor="#4f46e5" />
          </Box>
        )}
      </Header>

      {/* wiadomości */}
      <MessagesWrapper ref={chatRef} p={3}>
        <GrayText>Napisz coś aby rozpocząć rozmowę</GrayText>
        {messages}
        {sendingMessage.isLoading && (
          <Box display="flex" justifyContent="flex-end" m={3}>
            <RotatingLines width="30" strokeColor="#4f46e5" />
          </Box>
        )}
      </MessagesWrapper>

      {/* dolny szary kontener z inputem */}
      <InputWrapper position="relative" py={1} px={3}>
        <Input
          sx={{ width: "100%" }}
          disableUnderline
          placeholder="Napisz wiadomość tutaj..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key == "Enter" && handleSendMessage()}
        />

        {/* ikony po prawej stronie */}
        <Box position="relative" display="flex" alignItems="center" gap={1}>
          {/* toglowanie emotek */}
          <Fab variant="transparent" onClick={toggleEmojisVisibility}>
            <SentimentSatisfiedAltIcon />
          </Fab>

          {/* dodawanie plików */}
          <Fab variant="transparent">
            <IconButton hidden component="label">
              <AttachFileIcon />
              <input type="file" multiple accept="image/png, image/jpeg" hidden onChange={handleFileChange} />
            </IconButton>
          </Fab>

          {/* wysyłanie wiadomości */}
          <Fab onClick={handleSendMessage} size="medium" color="primary">
            <SendIcon />
          </Fab>

          {/* emotki  */}
          {isEmojisVisible && (
            <EmojiWrapper toggleEmojisVisibility={toggleEmojisVisibility}>
              <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
            </EmojiWrapper>
          )}
        </Box>

        {/* podgląd wybranych plików */}
        {files.length > 0 && (
          <FilesPreviewWrapper container rowSpacing={1} columnSpacing={1}>
            {files.map((file, index) => (
              <FileItem key={index} file={file} single={files.length == 1} onRemove={() => handleRemoveFile(index)} />
            ))}
          </FilesPreviewWrapper>
        )}
      </InputWrapper>

      {/* ustawienia czatu */}
      <ChatSettings areSettingsVisible={areSettingsVisible} toggleSettingsVisibility={toggleSettingsVisibility} />
    </Wrapper>
  );
};

export default Chat;
