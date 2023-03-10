import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Button, Fab, List, Typography } from "@mui/material";

import { AvatarV2 } from "../../../components/components";
import useChat from "../../../hooks/useChat";
import useToggle from "../../../hooks/useToggle";
import { Content, Footer, Header, ListSingleItem, Wrapper } from "./components";
import { DeleteChatModal, ManageChatUsersModal, UpdateChatModal } from "./Modals";

type ChatSettingsProps = { areSettingsVisible: boolean; toggleSettingsVisibility: (to?: unknown) => void };
const ChatSettings = ({ areSettingsVisible, toggleSettingsVisibility }: ChatSettingsProps) => {
  const [isDeleteChatModalVisible, toggleDeleteChatModalVisibility] = useToggle();
  const [isUpdateChatModalVisible, toggleUpdateChatModalVisibility] = useToggle();
  const [isManageUsersModalVisible, toggleManageUsersModalVisibility] = useToggle();
  const currentChat = useChat((state) => state.currentChat)!;
  const getChatName = useChat((state) => state.getChatName);

  return (
    <Wrapper maxWidth={areSettingsVisible ? "90%" : "0px"}>
      {/* przycisk do zamykania ustwaień */}
      <Header>
        <Fab variant="transparent" onClick={toggleSettingsVisibility}>
          <CloseIcon fontSize="large" />
        </Fab>
      </Header>
      <Content>
        {/* zdjęcie czatu */}
        <AvatarV2 name={currentChat.name} src={currentChat.photoURL} sx={{ height: 175, width: 175 }} />

        {/* nazwa czatu */}
        <Typography variant="h4" fontWeight={500}>
          {getChatName(currentChat)}
        </Typography>

        {/* rodzaj czatu */}
        <Typography display="flex" alignItems="center" gap={1} color="gray">
          <ChatIcon /> Rodzaj czatu - {currentChat.type == "group" ? "grupowy" : "indywidualny"}
        </Typography>

        {/* lista uczestników */}
        <List sx={{ mt: 2, maxHeight: "30vh", minHeight: 125, overflow: "auto", mr: 2 }}>
          <Typography display="flex" alignItems="center" gap={1} ml={3} color="gray">
            <PeopleIcon /> Uczestnicy
          </Typography>
          {currentChat.participants.map((parti, index) => (
            <ListSingleItem key={"list-item-" + index} user={parti!} />
          ))}
        </List>

        {/* stoka z przyciskami */}
        <Footer>
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            <Button variant="contained" onClick={() => toggleUpdateChatModalVisibility(true)}>
              Zaktualizuj czat
            </Button>
            {currentChat.type == "group" && (
              <Button variant="contained" color="error" onClick={() => toggleDeleteChatModalVisibility(true)}>
                Usuń czat
              </Button>
            )}
            {currentChat.type == "group" && (
              <Button variant="contained" color="info" onClick={() => toggleManageUsersModalVisibility(true)}>
                Zarządzaj użytkownikami
              </Button>
            )}
          </Box>
        </Footer>
      </Content>

      {/* modal do usuwania czatu */}
      <DeleteChatModal open={isDeleteChatModalVisible} changeVisibility={toggleDeleteChatModalVisibility} />

      {/* modal do aktualizacji informacji chatu */}
      <UpdateChatModal open={isUpdateChatModalVisible} changeVisibility={toggleUpdateChatModalVisibility} />

      {/* modal do zarządzania użytkownikami */}
      <ManageChatUsersModal open={isManageUsersModalVisible} changeVisibility={toggleManageUsersModalVisibility} />
    </Wrapper>
  );
};

export default ChatSettings;
