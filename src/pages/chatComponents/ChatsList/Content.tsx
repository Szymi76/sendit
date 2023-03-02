import AddCircleIcon from "@mui/icons-material/AddCircle";
import EastIcon from "@mui/icons-material/East";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WestIcon from "@mui/icons-material/West";
import { Avatar, Box, styled, SxProps, TextField, Theme, Typography } from "@mui/material";

/*
    Styl dla ikon
*/

const iconSx: SxProps<Theme> = {
  fontSize: 30,
  color: (theme) => theme.palette.common.white,
  cursor: "pointer",
};

/*
    Główny wrapper (fioletowy kontener)
*/

export type WrapperProps = { children: React.ReactNode };

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: 24,
  backgroundColor: theme.palette.primary.main,
  padding: "24px 0",
  height: "calc(100vh - 44px)",
  color: theme.palette.common.white,
  maxWidth: 375,
  transform: "width",
  transitionDuration: "200ms",
}));

/*
    Trzy ikony na samej górze
*/

export type HeaderProps = { toggleListVisibility: () => void; toggleCreateNewChatVisibility: () => void };

export const Header = ({ toggleListVisibility, toggleCreateNewChatVisibility }: HeaderProps) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" px={2}>
      <WestIcon sx={iconSx} onClick={toggleListVisibility} />
      <Box display="flex" alignItems="center" gap={1}>
        <AddCircleIcon sx={iconSx} onClick={toggleCreateNewChatVisibility} />
        <MoreVertIcon sx={iconSx} />
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
    Karta dla każdego poszególnego czatu
*/

export type ChatCardProps = { photoURL: string; name: string };

export const ChatCard = ({ name, photoURL }: ChatCardProps) => {
  return (
    <Box
      display="flex"
      gap={2}
      p="8px 16px"
      sx={{ ":hover": { backdropFilter: "brightness(120%)" }, cursor: "pointer" }}
    >
      <Avatar src={photoURL} />
      <Box>
        <Typography variant="body2" fontWeight={500}>
          {name}
        </Typography>
        {/* kawałek ostatniej wiadomości */}
      </Box>
      <Box>{/* liczba nie przeczytanych wiadomości */}</Box>
    </Box>
  );
};

/*
    Wrapper dla wszystkich kart czatów
*/

export const CardsWrapper = styled(Box)({
  display: "flex",
  flexDirection: "column",
});

/*
    Kontener ze strzałką do pokazania listy
*/

export type HiddenListProps = { toggleListVisibility: () => void };

export const HiddenList = ({ toggleListVisibility }: HiddenListProps) => {
  return (
    <Box p="0 16px">
      <EastIcon sx={iconSx} onClick={toggleListVisibility} />
    </Box>
  );
};
