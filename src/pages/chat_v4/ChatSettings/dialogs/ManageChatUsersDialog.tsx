import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { AvatarV2 } from "../../../../components/components";
import useChat from "../../../../hooks/useChat";
import { User } from "../../../../hooks/useChat/types/client";

const ManageChatUsersDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [users, setUsers] = useState<string[]>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);

  // ZMIANA UCZESTNIKÓW CZATU
  const handleChangeParticipants = async () => {
    await changeChatParticipants(chat.id, users);
    onClose();
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
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Zarządzaj uczestnikami czatu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
          <Alert severity="success">Liczba uczestników, która zostanie dodana {numberOfUsers.toAdd}</Alert>
        )}
        {numberOfUsers.toRemove > 0 && (
          <Alert severity="error">Liczba uczestników, która zostanie usunięta {numberOfUsers.toRemove}</Alert>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleChangeParticipants}>Zapisz</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ManageChatUsersDialog;
