import ClearIcon from "@mui/icons-material/Clear";
import { Avatar, Box, Button, Fab, styled, Typography } from "@mui/material";

import { UserObject } from "../../../firebase/collections";
import { OptionItem } from "./utils";

/* 
    Jasno szary kontener dla całego komponentu dodawania nowego czatu
*/

export const Wrapper = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  gap: theme.spacing(1),
  backgroundColor: theme.palette.grey[100],
  width: "60%",
  borderRight: "1px solid",
  borderColor: theme.palette.grey[300],
}));

/* 
    Duży napis w lewym górnym roku oraz przycisk do dodawania czatu
*/

export type HeaderProps = { isButtonDisabled: boolean; handleCreateNewChat: () => void };

export const Header = ({ isButtonDisabled, handleCreateNewChat }: HeaderProps) => {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="1px solid"
      sx={{ borderColor: (theme) => theme.palette.grey[300] }}
      padding={2}
    >
      <Typography variant="h4" fontWeight={500}>
        Utwórz nowy czat
      </Typography>
      <Button variant="contained" sx={{ px: 4 }} disabled={isButtonDisabled} onClick={handleCreateNewChat}>
        Utwórz
      </Button>
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
    Podgląd wybranego zdjęcia i opcja usunięcia go
*/

export type PhotoPreviewProps = { photoURL: File | null; name: string; onClear: () => void };

export const PhotoPreview = ({ photoURL, name, onClear }: PhotoPreviewProps) => {
  return (
    <Box position="relative">
      <Avatar
        sx={{ width: 88, height: 88 }}
        src={photoURL ? URL.createObjectURL(photoURL) : undefined}
        alt="Awatar nowego czatu"
      >
        {!photoURL && name[0]}
      </Avatar>
      <Fab size="small" sx={{ position: "absolute", bottom: -10, left: 70 }} onClick={onClear}>
        <ClearIcon />
      </Fab>
    </Box>
  );
};

/* 
    Pojedyńczy element w z listy komponentu Autocomplete
*/

export type OptionProps = {
  props: React.HTMLAttributes<HTMLLIElement>;
  option: OptionItem;
  friendsList: Map<string, UserObject>;
};

export const Option = ({ props, option, friendsList }: OptionProps) => {
  const photoURL = friendsList.get(option.uid)?.val?.photoURL;

  return (
    <li {...props} style={{ display: "flex", gap: "16px", alignItems: "center" }}>
      <Avatar src={photoURL} alt="Zdjęcie profilowe użytkownika" />
      <Typography>{option.label}</Typography>
    </li>
  );
};
