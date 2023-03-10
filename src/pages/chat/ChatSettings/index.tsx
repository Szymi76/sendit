import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Button, Fab, List, Typography } from "@mui/material";

import { AvatarV2 } from "../../../components/components";
import useChat from "../../../hooks/useChat";
import { useChatSettings } from "../../../hooks/useChat/hooks";
import useToggle from "../../../hooks/useToggle";
import { Content, Footer, Header, ListSingleItem, Wrapper } from "./components";
import { DeleteChatModal, ManageChatUsersModal, UpdateChatModal } from "./Modals";

type ChatSettingsProps = { areSettingsVisible: boolean; toggleSettingsVisibility: (to?: unknown) => void };

const ChatSettings = ({ areSettingsVisible, toggleSettingsVisibility }: ChatSettingsProps) => {
  const [isDeleteChatModalVisible, toggleDeleteChatModalVisibility] = useToggle();
  const [isUpdateChatModalVisible, toggleUpdateChatModalVisibility] = useToggle();
  const [isManageUsersModalVisible, toggleManageUsersModalVisibility] = useToggle();
  const { currentChat, subscribe, subscribingTo, updateChat, deleteChat, getChatName, getChatById } = useChatSettings();

  const chat = currentChat!;

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
        <AvatarV2 name={chat.name} src={chat.photoURL} sx={{ height: 175, width: 175 }} />

        {/* nazwa czatu */}
        <Typography variant="h4" fontWeight={500}>
          {getChatName(chat)}
        </Typography>

        {/* rodzaj czatu */}
        <Typography display="flex" alignItems="center" gap={1} color="gray">
          <ChatIcon /> Rodzaj czatu - {chat.type == "group" ? "grupowy" : "indywidualny"}
        </Typography>

        {/* lista uczestników */}
        <List sx={{ mt: 2, maxHeight: "30vh", minHeight: 125, overflow: "auto", mr: 2 }}>
          <Typography display="flex" alignItems="center" gap={1} ml={3} color="gray">
            <PeopleIcon /> Uczestnicy
          </Typography>
          {chat.participants.map((parti, index) => (
            <ListSingleItem key={"list-item-" + index} user={parti!} />
          ))}
        </List>

        {/* stoka z przyciskami */}
        <Footer>
          <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">
            <Button variant="contained" onClick={() => toggleUpdateChatModalVisibility(true)}>
              Zaktualizuj czat
            </Button>
            {chat.type == "group" && (
              <Button variant="contained" color="error" onClick={() => toggleDeleteChatModalVisibility(true)}>
                Usuń czat
              </Button>
            )}
            {chat.type == "group" && (
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
