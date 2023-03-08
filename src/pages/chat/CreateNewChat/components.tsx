import TryIcon from "@mui/icons-material/Try";
import { Avatar, Box, Button, Fab, IconButton, styled, Typography } from "@mui/material";
import { RotatingLines } from "react-loader-spinner";

import { User } from "../../../hooks/useChat/types/client";
import { OptionItem } from "./utils";
/* 
    Jasno szary kontener dla całego komponentu dodawania nowego czatu
*/

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  width: "100%",
  borderRight: "1px solid",
  borderColor: theme.palette.grey[300],
}));

/* 
    Duży napis w lewym górnym roku oraz przycisk do dodawania czatu
*/

export type HeaderProps = { handleCreateNewChat: () => void };

export const Header = ({ handleCreateNewChat }: HeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
      sx={{ borderColor: (theme) => theme.palette.grey[300] }}
      padding={2}
    >
      <Typography variant="h4" maxWidth="70%" fontWeight={500}>
        Utwórz nowy czat grupowy
      </Typography>
      <Fab color="primary" onClick={handleCreateNewChat}>
        <TryIcon />
      </Fab>
    </Box>
  );
};

/* 
    Input w postaci przycisku do dodawania plików
*/

export type FileInputProps = { onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; label: string };

export const FileInput = ({ label, onChange }: FileInputProps) => {
  return (
    <Button sx={{ mt: 3 }} variant="contained" component="label">
      {label}
      <input type="file" hidden onChange={onChange} />
    </Button>
  );
};

/* 
    Pojedyńczy element w z listy komponentu Autocomplete
*/

export type OptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: OptionItem;
  friends: User[];
};

export const Option = ({ props, option, friends }: OptionProps) => {
  const user = friends.find((user) => user.uid == option.uid)!;

  return (
    <li {...props} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Avatar src={user?.photoURL ? user.photoURL : undefined} alt="Zdjęcie profilowe użytkownika">
        {!user?.photoURL && user?.displayName}
      </Avatar>
      <Typography>{option.label}</Typography>
    </li>
  );
};

export const Loading = () => {
  return (
    <Box
      position="fixed"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      sx={{ height: "calc(100vh - 44px)", bgcolor: "rgba(0,0,0,0.2)" }}
      zIndex={2000}
    >
      <RotatingLines strokeColor="white" />
    </Box>
  );
};
