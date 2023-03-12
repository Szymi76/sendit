import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PersonRemoveIcon from "@mui/icons-material/PersonRemove";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
} from "@mui/material";
import { where } from "firebase/firestore";
import { useState } from "react";

import { AvatarV2 } from "../../components/components";
import useAuth from "../../firebase/hooks/useAuth";
import useGetDocumentsWithQuery from "../../firebase/hooks/useGetDocuments";
import useChat from "../../hooks/useChat";
import { User } from "../../hooks/useChat/types/client";
import { IconAsButton } from "../chat_v4/components";
import { useStates } from "../chat_v4/states";

const Search = () => {
  const isSearchDialogVisible = useStates((state) => state.isSearchDialogVisible);
  const changeSearchDialogVisibility = useStates((state) => state.changeSearchDialogVisibility);

  const onClose = () => changeSearchDialogVisibility(false);

  const { user, isLoading } = useAuth();
  const { data: users } = useGetDocumentsWithQuery<User>("users", where("displayName", "!=", user!.displayName));

  return (
    <Dialog
      open={isSearchDialogVisible}
      onClose={onClose}
      scroll="body"
      aria-labelledby="scroll-dialog-title"
      aria-describedby="scroll-dialog-description"
      fullWidth
    >
      <DialogTitle>Lista użytkowników</DialogTitle>
      <DialogContent dividers>
        <List>
          {users.map((u) => (
            <UserCard key={u.uid} user={u} />
          ))}
        </List>
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleClick = () => {
    setSnackbarOpen(true);
    toggleUserAsFriend(user.uid);
  };

  const onClose = () => setSnackbarOpen(false);

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
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={onClose}>
        <Alert color="info">
          {isFriend
            ? `Ty i ${user.displayName} jesteście od teraz znajomymi 🙂`
            : `Ty i ${user.displayName} już nie jesteście znajomymi 😥`}
        </Alert>
      </Snackbar>
    </ListItemButton>
  );
};
