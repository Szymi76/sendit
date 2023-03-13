import TryIcon from "@mui/icons-material/Try";
import { Autocomplete, Box, styled, TextField, Typography } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import { useState } from "react";

import { AvatarV2, FileInput } from "../../../components/components";
import useChat from "../../../hooks/useChat";
import { useCreateNewChat } from "../../../hooks/useChat/hooks";
import { IconAsButton } from "../components";
import { CHAT_ROOM_HEADER_SPACING } from "../constants";
import { useStates } from "../states";
import { DataType, Errors, OptionItem, validateNameField, validateParticipantsField } from "./utils";

const CreateNewChat = () => {
  const [data, setData] = useState<DataType>({ name: "", participants: [], photoURL: null });
  const [errors, setErrors] = useState<Errors>({ name: null, participants: null, active: false });
  const { currentUser, createChat, friends, creatingChat } = useCreateNewChat();
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

  const options: OptionItem[] = friends.map(({ uid, displayName }) => {
    return { label: displayName, uid };
  });

  // onChange dla uczestników czatu
  const handleParticipantsChange = (e: any, value: OptionItem[]) => {
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
          options={options}
          onChange={handleParticipantsChange}
          value={data.participants}
          isOptionEqualToValue={(option, value) => option.uid == value.uid}
          renderOption={(props, option) => <Option key={option.uid} props={props} option={option} />}
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
      {creatingChat.isLoading && <Loading />}
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

const Option = ({ props, option }: { props: React.HTMLAttributes<HTMLLIElement>; option: OptionItem }) => {
  const friends = useChat((state) => state.friends);
  const user = friends.find((user) => user.uid == option.uid)!;

  return (
    <li {...props} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <AvatarV2 name={user.displayName} src={user.photoURL} />
      <Typography>{option.label}</Typography>
    </li>
  );
};

const Loading = () => {
  return (
    <Box
      position="fixed"
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ bgcolor: "rgba(0,0,0,0.2)" }}
      zIndex={2000}
    >
      <CircularProgress color="primary" size={60} />
    </Box>
  );
};
