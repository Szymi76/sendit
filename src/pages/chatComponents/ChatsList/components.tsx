import AddCircleIcon from "@mui/icons-material/AddCircle";
import EastIcon from "@mui/icons-material/East";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WestIcon from "@mui/icons-material/West";
import {
  Box,
  Fab,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  styled,
  SxProps,
  TextField,
  Theme,
} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

import { AvatarV2 } from "../../../components/components";
import { ChatPretty } from "../../../firebase/types";
import { useChat } from "../../../providers/ChatProvider";

/*
    Styl dla ikon
*/

const iconSx: SxProps<Theme> = {
  fontSize: 30,
  color: (theme) => theme.palette.common.white,
};

/*
    Główny wrapper (fioletowy kontener)
*/

export type WrapperProps = { children: React.ReactNode };

export const Wrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.between("xs", "md")]: {
    position: "absolute",
    zIndex: 1200,
    left: 0,
  },
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 24,
  backgroundColor: theme.palette.primary.main,
  padding: "24px 0",
  height: "calc(100vh - 44px)",
  color: theme.palette.common.white,
  maxWidth: 375,
  transform: "width",
  transitionDuration: "250ms",
  borderTop: "1px solid",
  borderColor: "rgba(0,0,0,.10)",
}));

/*
    Trzy ikony na samej górze
*/

export type HeaderProps = { toggleListVisibility: () => void; toggleCreateNewChatVisibility: (to: unknown) => void };

export const Header = ({ toggleListVisibility, toggleCreateNewChatVisibility }: HeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
      <Fab variant="transparent" size="small">
        <WestIcon sx={iconSx} onClick={toggleListVisibility} />
      </Fab>
      <Box display="flex" alignItems="center" gap={1}>
        <Fab variant="transparent" size="small">
          <AddCircleIcon sx={iconSx} onClick={toggleCreateNewChatVisibility} />
        </Fab>
        <Fab variant="transparent" size="small">
          <MoreVertIcon sx={iconSx} />
        </Fab>
      </Box>
    </Box>
  );
};

/*
    Pole tekstowe do filtrowania czatów
*/

export const SearchInput = styled(TextField)(({ theme }) => ({
  margin: "auto",
  backdropFilter: "brightness(120%)",
  color: theme.palette.common.white,
  outline: "none !important",
  borderRadius: "4px",
  overflow: "hidden",
  width: "100%",
}));

/*
    Wrapper dla ikon pod polem tekstowym
*/

export const ActionsWrapper = styled(Box)({
  display: "flex",
  justifyContent: "flex-start",
  alignItems: "center",
  padding: "0 16px",
  gap: "16px",
});

/*
    Kontener ze strzałką do pokazania listy
*/

export type HiddenListProps = { toggleListVisibility: () => void };

export const HiddenList = ({ toggleListVisibility }: HiddenListProps) => {
  return (
    <Box display="flex" justifyContent="center">
      <Fab variant="transparent" size="small">
        <EastIcon sx={iconSx} onClick={toggleListVisibility} />
      </Fab>
    </Box>
  );
};

/*
   Pojedyńczy element listy czatów
*/

export type SingleListItemProps = { chat: ChatPretty; onClick: () => void };

export const SingleListItem = ({ chat, onClick }: SingleListItemProps) => {
  const {
    utils: { getChatName },
  } = useChat();

  const chatName = getChatName(chat);

  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ py: 2 }} onClick={onClick}>
        <ListItemAvatar>
          <AvatarV2 src={chat.photoURL} name={chatName} />
        </ListItemAvatar>
        <ListItemText primary={chatName} />
      </ListItemButton>
    </ListItem>
  );
};

export const Loading = () => {
  return (
    <Box display="flex" justifyContent="center">
      <RotatingLines width="26" strokeColor="white" />
    </Box>
  );
};
