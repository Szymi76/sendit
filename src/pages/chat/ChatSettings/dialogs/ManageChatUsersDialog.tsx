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

import AvatarV2 from "../../../../components/AvatarV2";
import useChat from "../../../../hooks/useChat";
import { User } from "../../../../hooks/useChat/types/client";
import { ChatRole, ChatRolesArray } from "../../../../hooks/useChat/types/other";

const ManageChatUsersDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [users, setUsers] = useState<string[]>([]);
  const [roles, setRoles] = useState<ChatRolesArray>([]);
  const chat = useChat((state) => state.currentChat)!;
  const friends = useChat((state) => state.friends);
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);
  const changeChatRoles = useChat((state) => state.changeChatRoles);
  const getUserRole = useChat((state) => state.getUserRole);
  const currentUser = useChat((state) => state.currentUser)!;

  // ZMIANA UCZESTNIKÓW CZATU
  const handleChangeParticipants = async () => {
    await changeChatParticipants(chat.id, users);
    const currentUserRole = getUserRole(currentUser.uid, chat.id);
    if (currentUserRole == "owner") await changeChatRoles(chat.id, roles);
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
  }, [chat.participants, friends]);

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
  }, [chat.participants, chat.roles]);

  // ZMIENIA ROLĘ UŻYTKOWNIKA
  const handleChangeRole = (e: SelectChangeEvent<ChatRole>, user: User) => {
    // @ts-ignore
    setRoles((roles) => {
      return roles.map((item) => (item.uid == user.uid ? { uid: item.uid, role: e.target.value } : item));
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
          {allPossibleUsers.map((user) => {
            if (!user) return <></>;

            // ROLA UŻYTKOWNIKA
            const roleObject = roles.find((val) => val.uid == user.uid);
            const role = roleObject ? roleObject.role : "user";

            const isCurrentUserOwner = getUserRole(currentUser.uid, chat.id) == "owner";
            const isChecked = users.includes(user.uid);
            const isDisabled =
              role == "owner" || currentUser.uid == user.uid || (role == "admin" && !isCurrentUserOwner);

            return (
              <ListItem
                key={user.uid}
                disablePadding
                secondaryAction={
                  <>
                    <Checkbox onChange={() => handleToggleUser(user.uid)} checked={isChecked} disabled={isDisabled} />
                    <SelectRole value={role} onChange={(e) => handleChangeRole(e, user)} role={role} />
                  </>
                }
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

const SelectRole = ({
  value,
  onChange,
  role,
}: {
  value: ChatRole;
  onChange: (e: SelectChangeEvent<ChatRole>) => void;
  role: ChatRole;
}) => {
  const currentUser = useChat((state) => state.currentUser)!;
  const currentChat = useChat((state) => state.currentChat)!;
  const getUserRole = useChat((state) => state.getUserRole);

  const currentUserRole = getUserRole(currentUser.uid, currentChat.id);
  const isUserOwner = role == "owner";

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
