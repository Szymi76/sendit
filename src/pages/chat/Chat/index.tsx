import { Box, styled } from "@mui/material";

import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatTextField from "./ChatTextField";

const Chat = () => {
  return (
    <Wrapper>
      {/* header z nazwą czatu i ustawieniami */}
      <ChatHeader />

      {/* wiadomości czatu */}
      <ChatMessages />

      {/* dolny szary kontener z inputem */}
      <ChatTextField />
    </Wrapper>
  );
};

export default Chat;

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  backgroundColor: theme.palette.grey[100],
  width: "100%",
  borderRight: "1px solid",
  borderColor: theme.palette.grey[300],
}));
