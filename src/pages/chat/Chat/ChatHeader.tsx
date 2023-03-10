import SettingsIcon from "@mui/icons-material/Settings";
import { Box, ClickAwayListener, Fab, styled, Drawer, SwipeableDrawer } from "@mui/material";
import Typography from "@mui/material/Typography";

import useChat from "../../../hooks/useChat";
import useToggle from "../../../hooks/useToggle";
import ChatSettings from "../ChatSettings";

const ChatHeader = () => {
  const currentChat = useChat((state) => state.currentChat)!;
  const getChatName = useChat((state) => state.getChatName);
  const [areSetingsVisible, toggleSettingsVisibility] = useToggle();

  const openSettings = () => toggleSettingsVisibility(true);
  const closeSettings = () => toggleSettingsVisibility(false);

  const chatName = getChatName(currentChat);

  return (
    <>
      <Wrapper p={2}>
        <Title variant="h4">{chatName}</Title>

        <Fab variant="transparent" onClick={openSettings}>
          <SettingsIcon />
        </Fab>
      </Wrapper>
      <SwipeableDrawer
        variant="permanent"
        anchor="right"
        open={areSetingsVisible}
        onClose={closeSettings}
        onOpen={openSettings}
      >
        <ChatSettings areSettingsVisible={areSetingsVisible} toggleSettingsVisibility={toggleSettingsVisibility} />
      </SwipeableDrawer>
    </>
  );
};

export default ChatHeader;

const Wrapper = styled(Box)(({ theme }) => ({
  position: "relative",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  backgroundColor: theme.palette.grey[100],
}));

const Title = styled(Typography)(({ theme }) => ({
  textOverflow: "ellipsis",
  overflow: "hidden",
  whiteSpace: "nowrap",
  maxWidth: "70%",
  fontWeight: 500,
}));
