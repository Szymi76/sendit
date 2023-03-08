import CloseIcon from "@mui/icons-material/Close";
import { Box, ClickAwayListener, Fab, Grid, styled, Typography } from "@mui/material";

import { AvatarV2 } from "../../../components/components";
import { User } from "../../../firebase/types";
import { Chat, Message } from "../../../hooks/useChat/types/client";

/* 
      Szary kontener z czatem
*/

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[100],
  width: "100%",
  borderRight: "1px solid",
  borderColor: theme.palette.grey[300],
}));

/* 
      Duży napis w lewym górnym roku oraz przycisk do dodawania czatu
*/

export type HeaderProps = { children: React.ReactNode; chat: Chat; currentUserUid: string };

export const Header = ({ children, chat, currentUserUid }: HeaderProps) => {
  const participantsWithoutMe = chat.participants.filter((p) => p!.uid != currentUserUid);
  const name = chat.type == "group" ? chat.name : participantsWithoutMe[0]!.displayName!;

  return (
    <Box
      position="relative"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
      itemType="1"
      sx={{ borderColor: (theme) => theme.palette.grey[300] }}
      bgcolor={(theme) => theme.palette.grey[100]}
      padding={2}
    >
      <Typography
        textOverflow="ellipsis"
        overflow="hidden"
        whiteSpace="nowrap"
        maxWidth="70%"
        variant="h4"
        fontWeight={500}
      >
        {name}
      </Typography>
      {children}
    </Box>
  );
};

/* 
    Wrapper na kontent wiadomości (autor, tekst i zdjęcia)
*/

export type MessageBoxContentPropsWrapper = { children: React.ReactNode; isMy: boolean };

export const MessageBoxContentWrapper = ({ children, isMy }: MessageBoxContentPropsWrapper) => {
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

/* 
    Pojedyńcze zdjęcie w wiadomości
*/

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

/* 
      Dymek z wiadomością 
*/

export type MessageBoxProps = { message: Message; currentUser: User };

export const MessageBox = ({ message, currentUser }: MessageBoxProps) => {
  const hours = message.createdAt.toDate().getHours();
  const minutes = message.createdAt.toDate().getMinutes();
  const author = message.author!;
  const isMy = author.uid == currentUser.uid;

  return (
    <Box width="100%" display="flex" justifyContent={isMy ? "flex-end" : "flex-start"}>
      <Box display="flex" flexDirection={isMy ? "row-reverse" : "row"}>
        {/* awatar i czas wysłania wiadomości */}
        <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
          <AvatarV2 name={author!.displayName} src={author.photoURL} />
          <Typography variant="subtitle2">{`${hours}:${minutes}`}</Typography>
        </Box>

        {/* fioletowy lub szary kontener z zawartością wiadomości */}
        <MessageBoxContentWrapper isMy={isMy}>
          {/* autor */}
          <Typography position="absolute" top={-20} left={5} variant="body2">
            {author.displayName}
          </Typography>
          {/* tekst wiadomości oraz zdjęcia */}
          <Box display="flex" flexDirection="column">
            {message.files.length > 0 && (
              <Box display="flex" flexWrap="wrap" justifyContent="center" gap={2} mb={1}>
                {message.files.map((file, index) => (
                  <ImageInMessage key={index} src={file as string} />
                ))}
              </Box>
            )}
            <Typography
              variant="body1"
              sx={{
                color: (theme) => {
                  return isMy ? theme.palette.common.white : theme.palette.common.black;
                },
              }}
            >
              {message.text}
            </Typography>
          </Box>
        </MessageBoxContentWrapper>
      </Box>
    </Box>
  );
};

/* 
      Kontener na wiadomości
*/

export const MessagesWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 4,
  height: "calc(100vh - 205px)",
  overflow: "auto",
}));

/* 
      Wrapper na input i ikony
*/

export const GrayText = styled(Typography)(({ theme }) => ({
  color: theme.palette.grey[600],
  textAlign: "center",
}));

export const InputWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.grey[200],
}));

/* 
     Wrapper na komponent do wybory emotek
*/

export type EmojiWrapperProps = { children: React.ReactNode; toggleEmojisVisibility: (to?: unknown) => void };

export const EmojiWrapper = ({ children, toggleEmojisVisibility }: EmojiWrapperProps) => {
  return (
    <ClickAwayListener onClickAway={toggleEmojisVisibility}>
      <Box width={{ xs: "250px", sm: "350px" }} position="absolute" top="-475px" right={{ xs: "0px", md: "125px" }}>
        {children}
      </Box>
    </ClickAwayListener>
  );
};

/* 
     Fioletowy grid na wybrane zdjęcia
*/

export const FilesPreviewWrapper = styled(Grid)(({ theme }) => ({
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

/* 
      Pojedyńcze zdjęcie w gridzie
*/

export type FileItemProps = { file: File; single: boolean; onRemove: () => void };

export const FileItem = ({ file, single, onRemove }: FileItemProps) => {
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
