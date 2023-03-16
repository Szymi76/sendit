import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";

import AvatarV2 from "../../../../components/AvatarV2";
import IconAsButton from "../../../../components/IconAsButton";
import { User } from "../../../../types/client";

export type UserCardProps = { user: User; currentUser: User; onToggleAsFriend: () => Promise<void> };

// KARTA UŻYTKOWNIKA POKAZYWANA W LIŚCIE
const UserCard = ({ user, currentUser, onToggleAsFriend }: UserCardProps) => {
  const isFriend = currentUser.friendsUids.includes(user.uid);

  return (
    <ListItemButton alignItems="flex-start">
      <ListItemAvatar>
        <AvatarV2 name={user.displayName} src={user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={user.displayName} />
      <IconAsButton
        icon={isFriend ? <PersonRemoveIcon /> : <PersonAddIcon />}
        title={isFriend ? "Usuń ze znajomych" : "Dodaj użytkownika do znajomych"}
        fabProps={{ variant: "transparent", onClick: onToggleAsFriend }}
        tooltipProps={{ PopperProps: { sx: { zIndex: 3000 } } }}
      />
    </ListItemButton>
  );
};

export default UserCard;
