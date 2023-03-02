import { Autocomplete, Box, TextField } from "@mui/material";
import { useState } from "react";

import { useChat } from "../../../providers/ChatProvider";
import { Header, Option, PhotoPreview, Wrapper } from "./Content";
import {
  DataType,
  Errors,
  filterOptionsArray,
  OptionItem,
  validateNameField,
  validateParticipantsField,
} from "./utils";

type CreateNewChatProps = { toggleVisibility: () => void };

const CreateNewChat = ({ toggleVisibility }: CreateNewChatProps) => {
  const [data, setData] = useState<DataType>({ name: "", participants: [], photoURL: null });
  const [errors, setErrors] = useState<Errors>({ name: null, participants: null, active: false });
  const { friendsList, currentUser, createChat, registerChat } = useChat();

  // tworzy nowy czat jeśli dane się zgadzają
  const handleCreateNewChat = async () => {
    const { name, participants, photoURL } = data;
    setErrors({ ...errors, active: true });

    // walidacja
    const nameErrors = validateNameField(name);
    const participantsErrors = validateParticipantsField(participants);
    if (nameErrors || participantsErrors || !currentUser || !currentUser.val) {
      setErrors({ ...errors, name: nameErrors, participants: participantsErrors });
      return console.warn("Validation failed");
    }

    const participantsIds = [...participants.map((p) => p.uid), currentUser.val.uid];
    const { id } = await createChat(participantsIds, "group", name);
    registerChat(id);
    toggleVisibility();
  };

  // @ts-ignore (opcje do komponentu Autocomplete)
  const options: OptionItem[] = filterOptionsArray(friendsList);

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
      <Header handleCreateNewChat={handleCreateNewChat} />
      <Box display="flex" flexDirection="column" gap={2} p={2} maxWidth={550}>
        <Autocomplete
          multiple
          options={options}
          onChange={handleParticipantsChange}
          value={data.participants}
          isOptionEqualToValue={(option, value) => option.uid == value.uid}
          renderOption={(props, option) => (
            <Option key={option.uid} props={props} option={option} friendsList={friendsList} />
          )}
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
          <PhotoPreview
            name={data.name}
            photoURL={data.photoURL}
            onClear={() => setData({ ...data, photoURL: null })}
            onChange={(e) => setData({ ...data, photoURL: e.target.files![0] })}
          />
        </Box>
      </Box>
    </Wrapper>
  );
};

export default CreateNewChat;
