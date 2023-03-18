import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { useChat } from "../../app/stores";

// DIALOG DO USUWANIA CZATU
const DeleteChatDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const chat = useChat((state) => state.currentChat)!;
  const deleteChat = useChat((state) => state.deleteChat);

  const handleDeleteChat = async () => {
    await deleteChat(chat.id);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Czy na pewno chcesz usunąć ten czat?</DialogTitle>
      <DialogContent>
        <DialogContentText display="flex" gap={1}>
          Kliknięcie usuń spowoduje nieodwracalne usnunięcie czatu.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button color="error" onClick={handleDeleteChat}>
          Usuń
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteChatDialog;
