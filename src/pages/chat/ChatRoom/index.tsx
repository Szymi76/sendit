import MoreVertIcon from "@mui/icons-material/MoreVert";
import { Box, styled, Typography } from "@mui/material";

import IconAsButton from "../../../components/IconAsButton";
import useChat from "../../../hooks/useChat";
import { CHAT_ROOM_HEADER_SPACING } from "../constants";
import { useStates } from "../states";
import BottomTextField from "./components/BottomTextField";
import Messages from "./components/Messages";

const ChatRoom = () => {
  const changeChatSettingsVisibilityTo = useStates((state) => state.changeChatSettingsVisibilityTo);
  const currentChat = useChat((state) => state.currentChat)!;
  const getChatName = useChat((state) => state.getChatName);

  const openSettings = () => changeChatSettingsVisibilityTo(true);

  return (
    <Wrapper>
      <Header>
        <Typography fontSize={28} fontWeight={500}>
          {getChatName(currentChat)}
        </Typography>
        <IconAsButton
          icon={<MoreVertIcon />}
          title="Pokaż informacje czatu"
          fabProps={{ variant: "transparent", onClick: openSettings }}
        />
      </Header>
      <Messages chatId={currentChat!.id} />
      <BottomTextField />
    </Wrapper>
  );
};

export default ChatRoom;

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  height: "100%",
  width: "100%",
}));

const Header = styled(Box)(({ theme }) => ({
  height: theme.spacing(CHAT_ROOM_HEADER_SPACING),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));
