import CloseIcon from "@mui/icons-material/Close";
import SettingsIcon from "@mui/icons-material/Settings";
import { Box, ClickAwayListener, Fab, Grid, styled, Typography } from "@mui/material";

import { UserAvatar } from "../../../components/components";
import { ChatPretty, PrettyMessage, User } from "../../../firebase/types";

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

export type HeaderProps = { chat: ChatPretty; currentUserUid: string };

export const Header = ({ chat, currentUserUid }: HeaderProps) => {
  const participantsWithoutMe = chat.participants.filter((p) => p.uid != currentUserUid);
  const name = chat.type == "group" ? chat.name : participantsWithoutMe[0].displayName!;

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
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
      <Fab variant="transparent">
        <SettingsIcon />
      </Fab>
    </Box>
  );
};

/* 
      Dymek z wiadomością 
*/

export type MessageBoxProps = { message: PrettyMessage; currentUser: User };

export const MessageBox = ({ message, currentUser }: MessageBoxProps) => {
  const hours = message.createdAt.toDate().getHours();
  const minutes = message.createdAt.toDate().getMinutes();

  const isMy = message.author.uid == currentUser.uid;

  return (
    <Box width="100%" display="flex" justifyContent={isMy ? "flex-end" : "flex-start"}>
      <Box display="flex" flexDirection={isMy ? "row-reverse" : "row"}>
        <Box display="flex" flexDirection="column" justifyContent="flex-end" alignItems="center">
          <UserAvatar user={message.author} />
          <Typography variant="subtitle2">{`${hours}:${minutes}`}</Typography>
        </Box>
        <Box
          maxWidth="400px"
          position="relative"
          my={7}
          mx={2}
          p={2}
          sx={{
            bgcolor: (theme) => {
              return isMy ? theme.palette.primary.main : theme.palette.grey[300];
            },
          }}
          borderRadius={`8px 8px ${isMy ? "0px" : "8px"} ${isMy ? "8px" : "0px"}`}
        >
          <Typography position="absolute" top={-20} left={5} variant="body2">
            {message.author.displayName}
          </Typography>
          <Typography
            display="flex"
            flexDirection="column"
            variant="body1"
            sx={{
              color: (theme) => {
                return isMy ? theme.palette.common.white : theme.palette.common.black;
              },
            }}
          >
            {message.files.length > 0 && (
              <Box display="flex" flexWrap="wrap" gap={2} mb={1}>
                {message.files.map((file, index) => {
                  return (
                    <img
                      key={index}
                      src={file as string}
                      height={125}
                      width={125}
                      style={{ borderRadius: 5, objectFit: "cover" }}
                      alt="Zdjęcie"
                    />
                  );
                })}
              </Box>
            )}
            {message.text}
          </Typography>
        </Box>
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

export const InputWrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.grey[200],
}));

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

export const FilesPreviewWrapper = styled(Grid)(({ theme }) => ({
  position: "absolute",
  left: "40px",
  top: "-258px",
  height: "250px",
  maxWidth: "250px",
  width: "90%",
  borderRadius: 5,
  backgroundColor: theme.palette.grey[300],
  padding: theme.spacing(2),
}));

export type FileItemProps = { file: File; single: boolean; onRemove: () => void };

export const FileItem = ({ file, single, onRemove }: FileItemProps) => {
  console.log(file);
  const src = URL.createObjectURL(file);

  return (
    <Grid position="relative" xs={single ? 12 : 6} display="flex" justifyContent="center" alignItems="center">
      <Box position="absolute" height="100%" width="100%" sx={{ opacity: "0", ":hover": { opacity: "1" } }}>
        <CloseIcon
          onClick={onRemove}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            cursor: "pointer",
            bgcolor: "rgba(255,255,255,.35)",
            borderRadius: 9999,
            color: (theme) => theme.palette.grey[900],
          }}
        />
      </Box>
      <img src={src} width="90%" height="90%" alt="Wybrane zdjęcie" style={{ borderRadius: 5, objectFit: "cover" }} />
    </Grid>
  );
};
