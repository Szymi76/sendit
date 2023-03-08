import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import PeopleIcon from "@mui/icons-material/People";
import { Box, Button, Fab, List, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";

import { AvatarV2, FileInput, SimpleModal } from "../../../components/components";
import { useChatSettings } from "../../../hooks/useChat/hooks";
import useToggle from "../../../hooks/useToggle";
import { useChat } from "../../../providers/ChatProvider";
import { Content, Footer, Header, ListSingleItem, Wrapper } from "./components";
import { UpdateValuesTypes } from "./utils";

// import ClickAwayListener from "@mui/material/ClickAwayListener";

type ChatSettingsProps = { areSettingsVisible: boolean; toggleSettingsVisibility: (to?: unknown) => void };

const ChatSettings = ({ areSettingsVisible, toggleSettingsVisibility }: ChatSettingsProps) => {
  const [isDeleteChatModalVisible, toggleDeleteChatModalVisibility] = useToggle();
  const [isUpdateChatModalVisible, toggleUpdateChatModalVisibility] = useToggle();
  const [updateValues, setUpdateValues] = useState<UpdateValuesTypes>({ name: "", photoURL: null });
  const { currentChat, subscribe, subscribingTo, updateChat, deleteChat, getChatName } = useChatSettings();

  const chat = currentChat!;

  // usuwanie czatu
  const handleDeleteChat = async () => {
    await deleteChat(chat.id);
    await subscribe(null);
  };

  // aktualizowanie czatu
  const handleUpdateChat = async () => {
    await updateChat(chat.id, updateValues.name, updateValues.photoURL);
    toggleUpdateChatModalVisibility(false);
  };

  // zamykanie modali
  const closeDeleteChatModal = () => toggleDeleteChatModalVisibility(false);
  const closeUpdateChatModal = () => toggleUpdateChatModalVisibility(false);

  useEffect(() => {
    setUpdateValues({ name: chat.name, photoURL: chat.photoURL });
  }, [chat]);

  // onChange na zmianę zdjęcia chatu do aktualizacji
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setUpdateValues({ ...updateValues, photoURL: files ? files[0] : null });
  };

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
          <Button variant="contained" onClick={() => toggleUpdateChatModalVisibility(true)}>
            Zaktualizuj czat
          </Button>
          <Button variant="contained" color="error" onClick={() => toggleDeleteChatModalVisibility(true)}>
            Usuń czat
          </Button>
        </Footer>
      </Content>

      {/* modal do usuwania czatu */}
      <SimpleModal
        disableRestoreFocus
        disableAutoFocus
        disableEnforceFocus
        open={isDeleteChatModalVisible}
        onClose={closeDeleteChatModal}
        primarytext="Czy na pewno chcesz usunąć ten czat?"
        buttons={[
          { label: "Cofnij", onClick: closeDeleteChatModal },
          { label: "Usuń", color: "error", onClick: handleDeleteChat, disabled: false },
        ]}
      />

      {/* modal do aktualizowania informacji czatu  */}
      <SimpleModal
        open={isUpdateChatModalVisible}
        onClose={closeUpdateChatModal}
        primarytext="Zaktualizuj informacje czatu"
        buttons={[
          { label: "Anuluj", onClick: closeUpdateChatModal },
          { label: "Zapisz", onClick: handleUpdateChat, disabled: false },
        ]}
      >
        <TextField
          sx={{ my: 2 }}
          variant="standard"
          label="Nazwa czatu"
          value={updateValues.name}
          onChange={(e) => setUpdateValues({ ...updateValues, name: e.target.value })}
        />
        <Box component="label" fontSize={12} color={(theme) => theme.palette.grey[600]}>
          Zdjęcie czatu
        </Box>
        <FileInput
          file={updateValues.photoURL}
          textToRepleceFile={chat.name}
          onFileChange={handleFileChange}
          onFileClear={() => setUpdateValues({ ...updateValues, photoURL: null })}
        />
      </SimpleModal>
    </Wrapper>
  );
};

export default ChatSettings;
