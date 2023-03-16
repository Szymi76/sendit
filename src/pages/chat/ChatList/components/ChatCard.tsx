import { ListItem, ListItemAvatar, ListItemButton, ListItemText } from "@mui/material";

import AvatarV2 from "../../../../components/AvatarV2";

export type ChatCardProps = { name: string; photo?: string | null; lastMessage?: string; onSelect: () => void };

// KARTA CZATU W LIŚCIE
const ChatCard = ({ name, photo, onSelect, lastMessage }: ChatCardProps) => {
  return (
    <ListItem disablePadding>
      <ListItemButton sx={{ py: 2 }} onClick={onSelect}>
        <ListItemAvatar>
          <AvatarV2 src={photo} name={name} />
        </ListItemAvatar>
        <ListItemText
          primary={name}
          secondary={lastMessage}
          secondaryTypographyProps={{ color: (theme) => theme.palette.grey[300], fontSize: 12, noWrap: true }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default ChatCard;
