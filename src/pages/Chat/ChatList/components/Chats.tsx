import { List, Typography } from "@mui/material";

export type ChatsProps = { chatsCards: JSX.Element[] };

// LISTA WSZYSTKICH KART CZATÓW
const Chats = ({ chatsCards }: ChatsProps) => {
  const isChatsArrayEmpty = chatsCards.length == 0;
  if (isChatsArrayEmpty) return <Typography p={2}>Brak wyników</Typography>;

  return <List sx={{ overflowY: "auto" }}>{chatsCards}</List>;
};

export default Chats;
