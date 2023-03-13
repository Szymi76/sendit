import AttachFileIcon from "@mui/icons-material/AttachFile";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Box, ClickAwayListener, Fab, Grid, IconButton, Input, styled, Tooltip } from "@mui/material";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { useState } from "react";

import IconAsButton from "../../../../components/IconAsButton";
import useChat from "../../../../hooks/useChat";
import useToggle from "../../../../hooks/useToggle";
import { CHAT_INPUT_SPACING } from "../../constants";

const BottomTextField = () => {
  const [isEmojisVisible, toggleEmojisVisibility] = useToggle();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");

  const sendMessage = useChat((state) => state.sendMessage);
  const currentChat = useChat((state) => state.currentChat)!;

  // WYSYŁANIE WIADOMOŚCI DO CZATU
  const handleSendMessage = async () => {
    if (text.trim().length == 0 && files.length == 0) return;
    await sendMessage(currentChat.id, text, files);
    setText("");
    setFiles([]);
  };

  // DODAWANIE PLIKÓW DO TABLICY
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length > 4) return console.warn("Too many files, max 4 avaiable");
    setFiles(Array.from(files));
  };

  // USUWANIE PLIKU Z TABLICY NA PODSTAWIE INDEXU
  const handleRemoveFile = (index: number) => {
    setFiles((files) => files.filter((file, i) => i != index));
  };

  // DODAWANIE EMOTEK DO POLA TEKSTOWEGO
  const handleEmojiClick = (emojiData: EmojiClickData) => setText(text + emojiData.emoji);

  // 'onChange' DLA POLA TEKSTOWEGO
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  // WYSYŁANIE WIADOMOŚCI PO KLIKNIĘCIU 'Enter'
  const handleInputKeyDown = (e: any) => e.key == "Enter" && handleSendMessage();

  // TABLICA PLIKÓW NIE JEST PUSTA
  const filesArrayIsNotEmpty = files.length > 0;

  return (
    <Wrapper py={1} px={3}>
      <Input
        sx={{ width: "100%" }}
        disableUnderline
        placeholder="Napisz wiadomość tutaj..."
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
      />

      <IconsWrapper>
        <IconAsButton
          icon={<SentimentSatisfiedAltIcon />}
          title="Emotki"
          fabProps={{ variant: "transparent", onClick: toggleEmojisVisibility }}
        />

        <Tooltip title="Załącz zdjęcia">
          <Fab variant="transparent">
            <IconButton hidden component="label">
              <AttachFileIcon />
              <input type="file" multiple accept="image/png, image/jpeg" hidden onChange={handleFileChange} />
            </IconButton>
          </Fab>
        </Tooltip>

        <IconAsButton
          icon={<SendIcon />}
          title="Wyślij"
          fabProps={{ color: "primary", size: "medium", onClick: handleSendMessage }}
        />

        {/* emotki  */}
        {isEmojisVisible && (
          <ClickAwayListener onClickAway={() => toggleEmojisVisibility(false)}>
            <EmojiPickerWrapper>
              <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" />
            </EmojiPickerWrapper>
          </ClickAwayListener>
        )}
      </IconsWrapper>

      {filesArrayIsNotEmpty && (
        <FilesPreviewWrapper container rowSpacing={1} columnSpacing={1}>
          {files.map((file, index) => (
            <FileItem key={index} file={file} single={files.length == 1} onRemove={() => handleRemoveFile(index)} />
          ))}
        </FilesPreviewWrapper>
      )}
    </Wrapper>
  );
};

export default BottomTextField;

const Wrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  height: theme.spacing(CHAT_INPUT_SPACING),
  backgroundColor: theme.palette.grey[200],
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const IconsWrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
}));

const EmojiPickerWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up("xs")]: {
    width: "250px",
    right: "0px",
  },
  [theme.breakpoints.up("md")]: {
    width: "350px",
    right: "125px",
  },
  position: "absolute",
  top: "-475px",
}));

const FilesPreviewWrapper = styled(Grid)(({ theme }) => ({
  position: "absolute",
  left: "40px",
  top: "-258px",
  height: "250px",
  maxWidth: "250px",
  width: "90%",
  borderRadius: 8,
  backgroundColor: theme.palette.primary.main,
  paddingRight: theme.spacing(1),
  paddingBottom: theme.spacing(1),
}));

type FileItemProps = { file: File; single: boolean; onRemove: () => void };

const FileItem = ({ file, single, onRemove }: FileItemProps) => {
  const src = URL.createObjectURL(file);

  return (
    <Grid item position="relative" xs={single ? 12 : 6} display="flex" justifyContent="center" alignItems="center">
      <Box position="absolute" height="100%" width="100%" sx={{ opacity: "0", ":hover": { opacity: "1" } }}>
        <CloseIcon
          onClick={onRemove}
          fontSize="large"
          sx={{
            position: "absolute",
            top: "50%",
            right: "50%",
            transform: "translate(50%, -50%)",
            cursor: "pointer",
            bgcolor: "rgba(255,255,255,.50)",
            borderRadius: 9999,
            color: (theme) => theme.palette.grey[900],
          }}
        />
      </Box>
      <img src={src} width="90%" height="90%" alt="Wybrane zdjęcie" style={{ borderRadius: 5, objectFit: "cover" }} />
    </Grid>
  );
};
