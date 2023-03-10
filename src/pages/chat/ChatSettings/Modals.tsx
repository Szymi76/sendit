import {
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { AvatarV2, FileInput, SimpleModal } from "../../../components/components";
import useChat from "../../../hooks/useChat";
import { User } from "../../../hooks/useChat/types/client";
import { UpdateValuesTypes } from "./utils";

export type ModalProps = { open: boolean; changeVisibility: (to: unknown) => void };

// modal do aktualizacji informacji chatu
export const UpdateChatModal = ({ open, changeVisibility }: ModalProps) => {
  const [updateValues, setUpdateValues] = useState<UpdateValuesTypes>({ name: "", photoURL: null });

  const chat = useChat((state) => state.currentChat)!;
  const updateChat = useChat((state) => state.updateChat);

  // aktualizowanie czatu
  const handleUpdateChat = async () => {
    await updateChat(chat!.id, updateValues.name, updateValues.photoURL);
    changeVisibility(false);
  };

  // onChange na zmianę zdjęcia chatu do aktualizacji
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setUpdateValues({ ...updateValues, photoURL: files ? files[0] : null });
  };

  useEffect(() => {
    setUpdateValues({ name: chat.name, photoURL: chat.photoURL });
  }, [chat]);

  return (
    <SimpleModal
      open={open}
      onClose={() => changeVisibility(false)}
      primarytext="Zaktualizuj informacje czatu"
      buttons={[
        { label: "Anuluj", onClick: () => changeVisibility(false) },
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
        textToRepleceFile={chat!.name}
        onFileChange={handleFileChange}
        onFileClear={() => setUpdateValues({ ...updateValues, photoURL: null })}
      />
    </SimpleModal>
  );
};

// modal do usuwania czatu
export const DeleteChatModal = ({ open, changeVisibility }: ModalProps) => {
  const chat = useChat((state) => state.currentChat)!;
  const deleteChat = useChat((state) => state.deleteChat);

  // usuwanie czatu
  const handleDeleteChat = async () => {
    await deleteChat(chat.id);
    changeVisibility(false);
  };

  return (
    <SimpleModal
      open={open}
      onClose={() => changeVisibility(false)}
      primarytext="Czy na pewno chcesz usunąć ten czat?"
      buttons={[
        { label: "Cofnij", onClick: () => changeVisibility(false) },
        { label: "Usuń", color: "error", onClick: handleDeleteChat, disabled: false },
      ]}
    />
  );
};

export const ManageChatUsersModal = ({ open, changeVisibility }: ModalProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);

  // zmiana uczestników
  const handleChangeParticipants = async () => {
    await changeChatParticipants(chat.id, users);
    changeVisibility(false);
  };

  const handleToggleParti = (id: string) => {
    const isIn = users.includes(id);
    setUsers(isIn ? users.filter((str) => str != id) : [...users, id]);
  };

  const allPossibleUsers: User[] = useMemo(() => {
    // @ts-ignore
    const all: User[] = [...chat.participants, ...friends];
    const ids = Array.from(new Set(all.map((user) => user.uid)));
    return ids.map((id) => all.find((user) => user.uid == id)!);
  }, [chat, friends]);

  const defaultCheckedUsers = useMemo(() => {
    const ids = chat.participants.map((p) => (p ? p.uid : null)!).filter((id) => id != null);
    const selectedUsers = allPossibleUsers.filter((user) => ids.includes(user.uid));
    const selectedIds = selectedUsers.map((user) => user.uid);
    return { users: selectedUsers, ids: selectedIds };
  }, [allPossibleUsers]);

  const numberOfUsers = useMemo(() => {
    const toAdd = users.filter((id) => !defaultCheckedUsers.ids.includes(id)).length;
    const toRemove = defaultCheckedUsers.ids.filter((id) => !users.includes(id)).length;
    return { toAdd, toRemove };
  }, [allPossibleUsers, users]);

  useEffect(() => {
    setUsers(defaultCheckedUsers.ids);
  }, []);

  return (
    <SimpleModal
      open={open}
      onClose={() => changeVisibility(false)}
      primarytext="Zarządzaj użytkownikami"
      buttons={[
        { label: "Anuluj", onClick: () => changeVisibility(false) },
        { label: "Zapisz", onClick: handleChangeParticipants, disabled: false },
      ]}
    >
      <List>
        {allPossibleUsers.map((user) => {
          if (!user) return <></>;

          return (
            <ListItem
              key={user.uid}
              secondaryAction={
                <Checkbox edge="end" onChange={() => handleToggleParti(user.uid)} checked={users.includes(user.uid)} />
              }
              disablePadding
            >
              <ListItemButton>
                <ListItemAvatar>
                  <AvatarV2 name={user.displayName} src={user.photoURL} />
                </ListItemAvatar>
                <ListItemText primary={user.displayName} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      {numberOfUsers.toAdd > 0 && (
        <Typography
          px={1}
          py={0.5}
          borderRadius={1}
          fontWeight={500}
          sx={{ bgcolor: (theme) => theme.palette.success.light }}
        >
          Liczba użytkowników do dodania - {numberOfUsers.toAdd}
        </Typography>
      )}
      {numberOfUsers.toRemove > 0 && (
        <Typography
          px={1}
          py={0.5}
          borderRadius={1}
          fontWeight={500}
          sx={{ bgcolor: (theme) => theme.palette.error.light }}
        >
          Liczba użytkowników do usunięcia - {numberOfUsers.toRemove}
        </Typography>
      )}
    </SimpleModal>
  );
};