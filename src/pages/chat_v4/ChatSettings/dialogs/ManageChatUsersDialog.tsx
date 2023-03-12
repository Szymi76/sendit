import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";

import { AvatarV2 } from "../../../../components/components";
import useChat from "../../../../hooks/useChat";
import { User } from "../../../../hooks/useChat/types/client";
import { ChatRole, ChatRolesArray } from "../../../../hooks/useChat/types/other";

const ManageChatUsersDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [users, setUsers] = useState<string[]>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);
  const changeChatRoles = useChat((state) => state.changeChatRoles);
  const [roles, setRoles] = useState<ChatRolesArray>([]);

  // ZMIANA UCZESTNIKÓW CZATU
  const handleChangeParticipants = async () => {
    await changeChatParticipants(chat.id, users);
    await changeChatRoles(chat.id, roles);
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
    setRoles(chat.roles);
  }, []);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Zarządzaj uczestnikami czatu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
        <DialogContentText display="flex" gap={1}>
          Tutaj możesz dodawać i usuwać uczestników oraz przyznawać pozwolenie uczestnikom na edytowanie oraz
          zarządzanie użytkownikami czatu. By zobaczyć użytkownika, którego chcesz dodać do czatu, musi być on twoim
          znajomym.
        </DialogContentText>
        <List>
          {allPossibleUsers.map((user) => {
            if (!user) return <></>;

            const item = roles.find((val) => val.uid == user.uid);
            const role = item ? item.role : "user";

            return (
              <ListItem
                key={user.uid}
                secondaryAction={
                  <>
                    <Checkbox
                      edge="end"
                      onChange={() => handleToggleUser(user.uid)}
                      checked={users.includes(user.uid)}
                    />
                    <SelectRole
                      value={role}
                      onChange={(e) =>
                        // @ts-ignore
                        setRoles((roles) => {
                          return roles.map((val) => {
                            if (val.role == "owner") return val;
                            if (e.target.value == "owner") return val;
                            return val.uid == user.uid ? { uid: user.uid, role: e.target.value } : val;
                          });
                        })
                      }
                    />
                  </>
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

const SelectRole = ({ value, onChange }: { value: ChatRole; onChange: (e: SelectChangeEvent<ChatRole>) => void }) => {
  return (
    <Select
      labelId="demo-simple-select-standard-label"
      id="demo-simple-select-standard"
      value={value}
      onChange={onChange}
      label="Age"
      variant="standard"
      sx={{ width: 125, ml: 3 }}
    >
      <MenuItem value="owner">Twórca</MenuItem>
      <MenuItem value="admin">Admin</MenuItem>
      <MenuItem value="user">Uczestnik</MenuItem>
    </Select>
  );
};
