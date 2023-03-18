import AttachFileIcon from "@mui/icons-material/AttachFile";
import SendIcon from "@mui/icons-material/Send";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { Box, ClickAwayListener, Fab, Grid, IconButton, Input, styled, Tooltip } from "@mui/material";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useMemo, useState } from "react";
import { useTheme } from "@mui/material/styles";
import { useChat } from "../../app/stores";
import IconAsButton from "../../components/IconAsButton";
import { CHAT_INPUT_SPACING } from "../../constants";
import useToggle from "../../hooks/useToggle";
import SingleFileInPreview from "./SingleFileInPreview";

// SZARY 'input' NA SAMYM DOLE CZATU, POSIADA WYBIERANIE EMOTEK I PLIKÓW
const BottomTextField = () => {
  const [isEmojisVisible, toggleEmojisVisibility] = useToggle();
  const [files, setFiles] = useState<File[]>([]);
  const [text, setText] = useState("");
  const sendMessage = useChat((state) => state.sendMessage);
  const currentChat = useChat((state) => state.currentChat)!;
  const theme = useTheme();

  // WYSYŁANIE WIADOMOŚCI DO CZATU
  const handleSendMessage = async () => {
    if (text.trim().length == 0 && files.length == 0) return;
    await sendMessage(currentChat.id, text, files);
    setText("");
    setFiles([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length > 4) return console.warn("Too many files, max 4 avaiable");
    setFiles(Array.from(files));
  };

  const handleRemoveFile = (index: number) => {
    setFiles((files) => files.filter((file, i) => i != index));
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => setText(text + emojiData.emoji);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value);

  const handleInputKeyDown = (e: any) => e.key == "Enter" && handleSendMessage();

  const filesArrayIsNotEmpty = files.length > 0;

  const previewFiles = useMemo(() => {
    return files.map((file, index) => {
      const isFileSingle = files.length == 1;
      const handleRemove = () => handleRemoveFile(index);

      return <SingleFileInPreview key={index} file={file} single={isFileSingle} onRemove={handleRemove} />;
    });
  }, [files]);

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
              <EmojiPicker onEmojiClick={handleEmojiClick} width="100%" theme={theme.palette.mode as Theme} />
            </EmojiPickerWrapper>
          </ClickAwayListener>
        )}
      </IconsWrapper>

      {filesArrayIsNotEmpty && (
        <FilesPreviewWrapper container rowSpacing={1} columnSpacing={1}>
          {previewFiles}
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
