import PeopleIcon from "@mui/icons-material/People";
import { List, styled, Typography } from "@mui/material";

import { Chat } from "../../../../types/client";
import SingleParticipant from "./SingleParticipant";

export type ParticipantsProps = { chat: Chat };

// LISTA UCZESTNIKÓW CZATU
const Participants = ({ chat }: ParticipantsProps) => {
  return (
    <WrapperAsList>
      <ListTitle>
        <PeopleIcon /> Uczestnicy
      </ListTitle>
      {chat.participants.map((user, index) => (
        <SingleParticipant key={user!.uid} user={user!} />
      ))}
    </WrapperAsList>
  );
};

export default Participants;

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
