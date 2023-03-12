import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import { where } from "firebase/firestore";
import { useMemo, useState } from "react";

import { AvatarV2 } from "../../components/components";
import useAuth from "../../firebase/hooks/useAuth";
import useGetDocumentsWithQuery from "../../firebase/hooks/useGetDocuments";
import useChat from "../../hooks/useChat";
import { User } from "../../hooks/useChat/types/client";
import { IconAsButton } from "../chat_v4/components";
import { useStates } from "../chat_v4/states";
import { usersWithMatchingQuery } from "./utils";

const Search = () => {
  const isSearchDialogVisible = useStates((state) => state.isSearchDialogVisible);
  const changeSearchDialogVisibility = useStates((state) => state.changeSearchDialogVisibility);
  const { user, isLoading } = useAuth();
  const { data: users } = useGetDocumentsWithQuery<User>("users", where("displayName", "!=", user!.displayName));
  const [query, setQuery] = useState("");

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
          {queriedUsers.map((u) => (
            <UserCard key={u.uid} user={u} />
          ))}
        </List>
        {queriedUsers.length == 0 && <Typography>Brak wyników</Typography>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
};

export default Search;

const UserCard = ({ user }: { user: User }) => {
  const currentUser = useChat((state) => state.currentUser);
  const isFriend = currentUser!.friends.includes(user.uid);
  const toggleUserAsFriend = useChat((state) => state.toggleUserAsFriend);

  const handleClick = async () => await toggleUserAsFriend(user.uid);

  return (
    <ListItemButton alignItems="flex-start">
      <ListItemAvatar>
        <AvatarV2 name={user.displayName} src={user.photoURL} />
      </ListItemAvatar>
      <ListItemText primary={user.displayName} />
      <IconAsButton
        icon={isFriend ? <PersonRemoveIcon /> : <PersonAddIcon />}
        title={isFriend ? "Usuń ze znajomych" : "Dodaj użytkownika do znajomych"}
        fabProps={{ variant: "transparent", onClick: handleClick }}
        tooltipProps={{ PopperProps: { sx: { zIndex: 3000 } } }}
      />
    </ListItemButton>
  );
};
