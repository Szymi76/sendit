import ShieldIcon from "@mui/icons-material/Shield";
import { Box, Divider, ListItem, ListItemAvatar, ListItemText, Tooltip } from "@mui/material";

import AvatarV2 from "../../../../components/AvatarV2";
import { ChatUser } from "../../../../types/other";

export type SingleParticipantProps = { user: ChatUser };

// POJEDYŃCZY ELEMENT LISTY UCZESTNIKÓW
const SingleParticipant = ({ user }: SingleParticipantProps) => {
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <AvatarV2 src={user.photoURL} name={user.displayName} />
        </ListItemAvatar>
        <ListItemText primary={<PrimaryText user={user} />} secondary={user.email} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
};
export default SingleParticipant;

type PrimaryTextProps = { user: ChatUser };

const PrimaryText = ({ user }: PrimaryTextProps) => {
  let prettyRole = "Uczestnik";
  if (user.role == "owner") prettyRole = "Twórca";
  if (user.role == "admin") prettyRole = "Admin";

  let iconColor = "info";
  if (user.role == "owner") iconColor = "warning";
  if (user.role == "admin") iconColor = "success";

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
