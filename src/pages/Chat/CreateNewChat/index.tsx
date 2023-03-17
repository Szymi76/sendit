import TryIcon from "@mui/icons-material/Try";
import { Autocomplete, Box, styled, TextField, Typography } from "@mui/material";
import { useState } from "react";

import { useChat, useStates } from "../../../app/stores";
import FileInput from "../../../components/FileInput";
import IconAsButton from "../../../components/IconAsButton";
import { CHAT_ROOM_HEADER_SPACING } from "../../../constants";
import { User } from "../../../types/client";
import AutocompleteOption from "./components/AutocompleteOption";
import CreatingNewChat from "./components/CreatingNewChat";
import { DataType, Errors, validateNameField, validateParticipantsField } from "./utils";

// KOMPONENT DO TWORZENIA NOWEGO CZATU
const CreateNewChat = () => {
  const [data, setData] = useState<DataType>({ name: "", participants: [], photoURL: null });
  const [errors, setErrors] = useState<Errors>({ name: null, participants: null, active: false });
  const currentUser = useChat((state) => state.currentUser);
  const createChat = useChat((state) => state.createChat);
  const friends = useChat((state) => state.friends);
  const creatingChat = useChat((state) => state.creatingChat);
  const changeCreateNewChatVisibilityTo = useStates((state) => state.changeCreateNewChatVisibilityTo);

  // tworzy nowy czat jeśli dane się zgadzają
  const handleCreateNewChat = async () => {
    const { name, participants, photoURL } = data;
    setErrors({ ...errors, active: true });

    // walidacja
    const nameErrors = validateNameField(name);
    const participantsErrors = validateParticipantsField(participants);
    if (nameErrors || participantsErrors || !currentUser) {
      setErrors({ ...errors, name: nameErrors, participants: participantsErrors });
      return console.warn("Validation failed");
    }

    const participantsIds = [...participants.map((p) => p.uid), currentUser.uid];
    await createChat(participantsIds, "group", name, photoURL!);

    changeCreateNewChatVisibilityTo(false);
  };

  // onChange dla uczestników czatu
  const handleParticipantsChange = (e: any, value: User[]) => {
    setData({ ...data, participants: value });
    const fieldError = validateParticipantsField(value);
    errors.active && setErrors({ ...errors, participants: fieldError });
  };

  // onChange dla nazwy czatu
  const handleNameChange = (value: string) => {
    setData({ ...data, name: value });
    const fieldErrors = validateNameField(value);
    errors.active && setErrors({ ...errors, name: fieldErrors });
  };

  return (
    <Wrapper>
      <Header>
        <HeaderText>Utwórz nowy czat</HeaderText>
        <IconAsButton
          icon={<TryIcon />}
          title="Utwórz czat"
          fabProps={{ color: "primary", size: "medium", onClick: handleCreateNewChat, sx: { boxShadow: "none" } }}
        />
      </Header>
      <Box display="flex" flexDirection="column" gap={4} p={3} maxWidth={550}>
        <Autocomplete
          multiple
          options={friends}
          onChange={handleParticipantsChange}
          value={data.participants}
          getOptionLabel={(option) => option.displayName}
          isOptionEqualToValue={(option, value) => option.uid == value.uid}
          renderOption={(props, option) => <AutocompleteOption key={option.uid} props={props} option={option} />}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="standard"
              label="Uczestnicy"
              error={Boolean(errors.participants)}
              helperText={errors.participants && errors.participants}
            />
          )}
          sx={{ width: { xs: "80%", md: 500, lg: 550 } }}
        />
        <TextField
          variant="standard"
          value={data.name}
          onChange={(e) => handleNameChange(e.target.value)}
          label="Nazwa czatu"
          error={Boolean(errors.name)}
          helperText={errors.name && errors.name}
        />
        <Box>
          <FileInput
            textToRepleceFile={data.name}
            file={data.photoURL}
            onFileChange={(e) => setData({ ...data, photoURL: e.target.files![0] })}
            onFileClear={() => setData({ ...data, photoURL: null })}
          />
        </Box>
      </Box>
      {creatingChat.isLoading && <CreatingNewChat />}
    </Wrapper>
  );
};

export default CreateNewChat;

const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  width: "100%",
  borderRight: "1px solid",
  borderColor: theme.palette.grey[300],
}));

const Header = styled(Box)(({ theme }) => ({
  height: theme.spacing(CHAT_ROOM_HEADER_SPACING),
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  color: theme.palette.grey[900],
  padding: theme.spacing(2),
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
}));

const HeaderText = styled(Typography)(({ theme }) => ({
  maxWidth: "70%",
  fontSize: 28,
  fontWeight: 500,
}));
