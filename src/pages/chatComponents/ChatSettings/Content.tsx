import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Box,
  Button,
  Divider,
  Fab,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  styled,
  TextField,
  Typography,
} from "@mui/material";

import { AvatarV2, ModalContentWrapper } from "../../../components/components";
import { ChatPretty, User } from "../../../firebase/types";
import { UpdateValuesTypes } from "./utils";

/* 
    Biały kontener ustawień czatu
*/

export const Wrapper = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: 0,
  right: 0,
  [theme.breakpoints.down("md")]: {
    width: "90%",
  },
  [theme.breakpoints.up("md")]: {
    width: 500,
  },
  backgroundColor: theme.palette.common.white,
  height: "100vh",
  borderLeft: `1px solid ${theme.palette.grey[300]}`,
  zIndex: 1100,
  transitionDuration: "250ms",
  paddingTop: "44px",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
}));

/* 
    Header ustawień
*/

export const Header = styled(Box)(({ theme }) => ({
  height: "90px",
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: theme.spacing(2),
}));

/* 
    Wrapper na kontent ustawień
*/

export const Content = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  gap: theme.spacing(2),
  overflow: "auto",
  flex: 1,
}));

/* 
    Pojedyńczy uczestnik w liście
*/

export type ListSingleItemProps = { user: User };

export const ListSingleItem = ({ user }: ListSingleItemProps) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <AvatarV2 src={user.photoURL} name={user.displayName} />
        </ListItemAvatar>
        <ListItemText primary={user.displayName} secondary={user.email} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};

/* 
    Wrapper na przyciski w stopce
*/

export const Footer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: theme.spacing(1),
  padding: theme.spacing(2),
  flex: 1,
}));
