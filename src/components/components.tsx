import { Avatar, SxProps, Theme } from "@mui/material";

import { User } from "../firebase/types";

export type UserAvatarProps = { user: User; sx?: SxProps<Theme> };

export const UserAvatar = ({ user, sx }: UserAvatarProps) => {
  const src = user.photoURL ? user.photoURL : undefined;

  return (
    <Avatar src={src} sx={sx}>
      {!user.photoURL && user.displayName}
    </Avatar>
  );
};
