import ChatIcon from "@mui/icons-material/Chat";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import { Box, styled, Typography } from "@mui/material";
import React from "react";

import { AvatarV2 } from "../../components/components";
import useChat from "../../hooks/useChat";
import { User } from "../../hooks/useChat/types/client";
import * as Content from "./Content";

type UserCardProps = { user: User };

const UserCard = ({ user }: UserCardProps) => {
  const { currentUser, toggleUserAsFriend } = useChat();

  const isUserFriend = currentUser!.friends.includes(user.uid);
  const FriendIcon = isUserFriend ? <PersonRemoveIcon color="error" /> : <PersonAddIcon color="success" />;
  const onClick = async () => await toggleUserAsFriend(user.uid);

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        boxShadow={2}
        width="95%"
        maxWidth="800px"
        mx="auto"
        borderRadius={2}
        p="4px 16px"
        bgcolor="white"
      >
        {children}
      </Box>
    );
  };

  return (
    <Wrapper>
      <Box display="flex" gap="16px">
        <AvatarV2 name={user.displayName} src={user.photoURL} />
        <Box display="flex" flexDirection="column">
          <Typography variant="h6">{user.displayName}</Typography>
          <Typography variant="caption">{user.email}</Typography>
        </Box>
      </Box>
      <Box display="flex" gap="8px" justifySelf="flex-end">
        <Content.Icon icon={<ChatIcon color="info" />} />
        <Content.Icon icon={FriendIcon} onClick={onClick} />
      </Box>
    </Wrapper>
  );
};

export default UserCard;
