import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";

import { useChat } from "../../app/stores";
import FileInput from "../../components/FileInput";

export type UpdateValuesTypes = { name: string; photoURL: File | null | string };

// DIALOG DO AKTUALIZACJI INFORMACJI CZATU
const UpdateChatDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const [updateValues, setUpdateValues] = useState<UpdateValuesTypes>({ name: "", photoURL: null });
  const chat = useChat((state) => state.currentChat)!;
  const updateChat = useChat((state) => state.updateChat);
  const theme = useTheme();
  const isDownSm = useMediaQuery(theme.breakpoints.down("sm"));

  // AKTUALIZOWANIE CZATU
  const handleUpdateChat = async () => {
    await updateChat(chat.id, { newName: updateValues.name, newPhoto: updateValues.photoURL });
    onClose();
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
    <Dialog open={open} onClose={onClose} fullWidth fullScreen={isDownSm}>
      <DialogTitle>Zmień informacje czatu</DialogTitle>
      <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button onClick={handleUpdateChat}>Zapisz</Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateChatDialog;
