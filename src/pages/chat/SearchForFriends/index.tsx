import SearchIcon from "@mui/icons-material/Search";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Input, List, Typography } from "@mui/material";
import { getDocs, where, query as fbQuery } from "firebase/firestore";
import { useMemo, useState, useEffect } from "react";

import { useChat, useStates } from "../../../app/stores";
import useAuth from "../../../firebase/hooks/useAuth";
import refs from "../../../firebase/utils/refs";
import { User } from "../../../types/client";
import UserCard from "./components/UserCard";
import { usersWithMatchingQuery } from "./utils";

// KOMPONENT DO WYSZUKIWANIA NOWYCH UŻYTKOWNIKÓW
const SearchForFriends = () => {
  const auth = useAuth();
  const [query, setQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const currentUser = useChat((state) => state.currentUser)!;
  const toggleUserAsFriend = useChat((state) => state.toggleUserAsFriend);
  const isSearchDialogVisible = useStates((state) => state.isSearchDialogVisible);
  const changeSearchDialogVisibility = useStates((state) => state.changeSearchDialogVisibility);

  useEffect(() => {
    const q = fbQuery(refs.users.col, where("displayName", "!=", auth.user!.displayName));
    getDocs(q).then((snapshot) => {
      const result: User[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        data && result.push(data);
      });
      setUsers(result);
    });
  }, [auth.user]);

  const onClose = () => changeSearchDialogVisibility(false);
  const queriedUsers = useMemo(() => usersWithMatchingQuery(users, query), [query, users]);
  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value);

  return (
    <Dialog
      open={isSearchDialogVisible}
      onClose={onClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
    >
      <DialogTitle>Poszukaj znajomych</DialogTitle>
      <DialogContent dividers>
        <Input
          startAdornment={<SearchIcon />}
          value={query}
          onChange={handleQueryChange}
          placeholder="np. Adama Kowalski"
          fullWidth
          sx={{ mt: 1, mb: 3 }}
        />
        <List>
          {queriedUsers.map((user) => {
            return (
              <UserCard
                key={user.uid}
                user={user}
                currentUser={currentUser}
                onToggleAsFriend={() => toggleUserAsFriend(user.uid)}
              />
            );
          })}
        </List>
        {queriedUsers.length == 0 && <Typography>Brak wyników</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchForFriends;
