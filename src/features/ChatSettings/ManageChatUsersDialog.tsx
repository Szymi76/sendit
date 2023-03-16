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

import { useChat } from "../../app/stores";
import AvatarV2 from "../../components/AvatarV2";
import { User } from "../../types/client";
import { ChatRole } from "../../types/other";

// DIALOG DO ZARZĄDZANIA UŻYTKOWNIKAMI CZATU (PRZYZNAWANIE ROL I USUWANIE/DODAWANIE UŻYTKOWNIKÓW)
const ManageChatUsersDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [users, setUsers] = useState<{ uid: string; role: ChatRole; checked: boolean }[]>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const updateChat = useChat((state) => state.updateChat);
  const getUserRole = useChat((state) => state.getUserRole);
  const currentUser = useChat((state) => state.currentUser)!;

  // ZMIANA UCZESTNIKÓW CZATU
  const handleChangeParticipants = async () => {
    const newParticipants = users
      .filter((user) => user.checked)
      .map((user) => {
        return { uid: user.uid, role: user.role };
      });
    await updateChat(chat.id, { newParticipants });
    onClose();
  };

  // WSZYSCY UŻYTKOWNICY, KTÓRZY POJAWIĄ SIĘ W LIŚCIE (participants + friends)
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
  }, [chat, allPossibleUsers]);

  // LICZBY OSÓB KTÓRE ZOSTANĄ dodane / usunięte
  const numberOfUsers = useMemo(() => {
    const toAdd = users
      .filter((user) => user.checked)
      .filter((user) => !defaultCheckedUsers.ids.includes(user.uid)).length;
    const toRemove = defaultCheckedUsers.ids.filter(
      (id) =>
        !users
          .filter((user) => user.checked)
          .map((u) => u.uid)
          .includes(id),
    ).length;
    return { toAdd, toRemove };
  }, [users, allPossibleUsers]);

  // DOMYŚLNE USTAWIANIE ZAZNACZONYCH UŻYTKOWNIKÓW
  useEffect(() => {
    const initialUsers = allPossibleUsers.map((user) => {
      const checked = defaultCheckedUsers.ids.includes(user.uid);
      const role = getUserRole(user.uid, chat.id);
      return { uid: user.uid, role, checked };
    });
    setUsers(initialUsers);
  }, [chat]);

  // ZMIENIA ROLĘ UŻYTKOWNIKA
  const handleChangeRole = (e: SelectChangeEvent<ChatRole>, uid: string) => {
    // @ts-ignore
    setUsers((users) => {
      return users.map((user) => {
        return user.uid == uid ? { ...user, role: e.target.value } : user;
      });
    });
  };

  // ZMIENIANIE UCZESTNICTWA UŻYTKOWNIKA
  const handleToggleUser = (uid: string) => {
    const checked = users.find((user) => user.uid == uid)!.checked;
    setUsers((users) => {
      return users.map((user) => {
        return user.uid == uid ? { ...user, checked: !checked } : user;
      });
    });
  };

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
          {users.map((user) => {
            const userValues = allPossibleUsers.find((val) => val.uid == user.uid);
            if (!userValues) return <></>;

            const isCurrentUserOwner = getUserRole(currentUser.uid, chat.id) == "owner";
            const isDisabled =
              user.role == "owner" || currentUser.uid == user.uid || (user.role == "admin" && !isCurrentUserOwner);

            return (
              <ListItem
                key={user.uid}
                disablePadding
                secondaryAction={
                  <>
                    <Checkbox
                      onChange={() => handleToggleUser(user.uid)}
                      checked={user.checked}
                      disabled={isDisabled}
                    />
                    <SelectRole value={user.role} onChange={(e) => handleChangeRole(e, user.uid)} />
                  </>
                }
              >
                <ListItemButton>
                  <ListItemAvatar>
                    <AvatarV2 name={userValues.displayName} src={userValues.photoURL} />
                  </ListItemAvatar>
                  <ListItemText primary={userValues.displayName} />
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
  const currentUser = useChat((state) => state.currentUser)!;
  const currentChat = useChat((state) => state.currentChat)!;
  const getUserRole = useChat((state) => state.getUserRole);

  const currentUserRole = getUserRole(currentUser.uid, currentChat.id);
  const isUserOwner = value == "owner";

  return (
    <Select
      label="Age"
      variant="standard"
      sx={{ width: 125, ml: 3 }}
      value={value}
      onChange={onChange}
      disabled={currentUserRole != "owner"}
    >
      <MenuItem value="owner" disabled>
        Twórca
      </MenuItem>

      <MenuItem value="admin" disabled={isUserOwner}>
        Admin
      </MenuItem>

      <MenuItem value="user" disabled={isUserOwner}>
        Uczestnik
      </MenuItem>
    </Select>
  );
};
