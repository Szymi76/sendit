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

// MODAL DO AKTUALIZACJI NAZWY I ZDJĘCIA CZATU
export const UpdateChatModal = ({ open, changeVisibility }: ModalProps) => {
  const [updateValues, setUpdateValues] = useState<UpdateValuesTypes>({ name: "", photoURL: null });

  const chat = useChat((state) => state.currentChat)!;
  const updateChat = useChat((state) => state.updateChat);

  // AKTUALIZOWANIE CZATU
  const handleUpdateChat = async () => {
    await updateChat(chat!.id, updateValues.name, updateValues.photoURL);
    changeVisibility(false);
  };

  // 'onChange' DLA NOWEGO ZDJĘCIA CZATU
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    setUpdateValues({ ...updateValues, photoURL: files ? files[0] : null });
  };

  // DOMYŚLNE USTAWIANIE AKTUALNYCH DANYCH
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

// MODAL DO USUWANIA CZATU
export const DeleteChatModal = ({ open, changeVisibility }: ModalProps) => {
  const chat = useChat((state) => state.currentChat)!;
  const deleteChat = useChat((state) => state.deleteChat);

  // USUWANIE CZATU
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

// MODAL DO ZARZĄDZANIA UCZESTNIKAMI CZATU
export const ManageChatUsersModal = ({ open, changeVisibility }: ModalProps) => {
  const [users, setUsers] = useState<string[]>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);

  // ZMIANA UCZESTNIKÓW CZATU
  const handleChangeParticipants = async () => {
    await changeChatParticipants(chat.id, users);
    changeVisibility(false);
  };

  // ZMIENIANIE UCZESTNICTWA UŻYTKOWNIKA
  const handleToggleUser = (id: string) => {
    const isIn = users.includes(id);
    setUsers(isIn ? users.filter((str) => str != id) : [...users, id]);
  };

  // WSZYSCY UŻYTKOWNICY, KTÓRZY POJAWIĄ SIĘ W LIŚCIE (participants + firends)
  const allPossibleUsers: User[] = useMemo(() => {
    // @ts-ignore
    const all: User[] = [...chat.participants, ...friends];
    const ids = Array.from(new Set(all.map((user) => user.uid)));
    return ids.map((id) => all.find((user) => user.uid == id)!);
  }, [chat, friends]);

  // DOMYŚLNIE ZAZNACZENI UCZESTNICY
  const defaultCheckedUsers = useMemo(() => {
    const ids = chat.participants.map((p) => (p ? p.uid : null)!).filter((id) => id != null);
    const selectedUsers = allPossibleUsers.filter((user) => ids.includes(user.uid));
    const selectedIds = selectedUsers.map((user) => user.uid);
    return { users: selectedUsers, ids: selectedIds };
  }, [allPossibleUsers]);

  // LICZBY OSÓB KTÓRE ZOSTANĄ dodane / usunięte
  const numberOfUsers = useMemo(() => {
    const toAdd = users.filter((id) => !defaultCheckedUsers.ids.includes(id)).length;
    const toRemove = defaultCheckedUsers.ids.filter((id) => !users.includes(id)).length;
    return { toAdd, toRemove };
  }, [allPossibleUsers, users]);

  // DOMYŚLNE USTAWIANIE ZAZNACZONYCH UŻYTKOWNIKÓW
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
                <Checkbox edge="end" onChange={() => handleToggleUser(user.uid)} checked={users.includes(user.uid)} />
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
