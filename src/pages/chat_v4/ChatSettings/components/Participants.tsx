import PeopleIcon from "@mui/icons-material/People";
import { Divider, List, ListItem, ListItemAvatar, ListItemText, styled, Typography } from "@mui/material";

import { AvatarV2 } from "../../../../components/components";
import useChat from "../../../../hooks/useChat";
import { User } from "../../../../hooks/useChat/types/client";

const Participants = () => {
  const currentChat = useChat((state) => state.currentChat)!;

  return (
    <WrapperAsList>
      <ListTitle>
        <PeopleIcon /> Uczestnicy
      </ListTitle>
      {currentChat.participants.map((user, index) => (
        <ListSingleItem key={user!.uid} user={user!} />
      ))}
    </WrapperAsList>
  );
};

export default Participants;

const ListSingleItem = ({ user }: { user: User }) => {
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

const WrapperAsList = styled(List)(({ theme }) => ({
  maxHeight: "30vh",
  minHeight: 125,
  overflow: "auto",
  marginTop: theme.spacing(2),
}));

const ListTitle = styled(Typography)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(3),
  color: theme.palette.grey[500],
  marginLeft: theme.spacing(2),
  marginTop: theme.spacing(2),
}));
