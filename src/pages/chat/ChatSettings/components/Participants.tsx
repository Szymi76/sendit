import PeopleIcon from "@mui/icons-material/People";
import ShieldIcon from "@mui/icons-material/Shield";
import { Box, Divider, List, ListItem, ListItemAvatar, ListItemText, styled, Tooltip, Typography } from "@mui/material";

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
  const PrimaryText = () => {
    const getUserRole = useChat((state) => state.getUserRole);
    const currentChat = useChat((state) => state.currentChat)!;

    const role = getUserRole(user.uid, currentChat.id);

    let prettyRole = "Uczestnik";
    if (role == "owner") prettyRole = "Twórca";
    if (role == "admin") prettyRole = "Admin";

    let iconColor = "info";
    if (role == "owner") iconColor = "warning";
    if (role == "admin") iconColor = "success";

    return (
      <Box display="flex" alignItems="center" gap={1}>
        {user.displayName}
        <Tooltip title={prettyRole}>
          {/* @ts-ignore */}
          <ShieldIcon color={iconColor} fontSize="small" />
        </Tooltip>
      </Box>
    );
  };

  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <AvatarV2 src={user.photoURL} name={user.displayName} />
        </ListItemAvatar>
        <ListItemText primary={<PrimaryText />} secondary={user.email} />
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
