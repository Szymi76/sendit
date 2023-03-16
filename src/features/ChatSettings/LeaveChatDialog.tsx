import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import { useChat } from "../../app/stores";

// DIALOG DO OPUSZCZANIA CZATU
const LeaveChatDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const currentChat = useChat((state) => state.currentChat)!;
  const currentUser = useChat((state) => state.currentUser)!;
  const updateChat = useChat((state) => state.updateChat);

  const handleLeaveChat = async () => {
    const participantsWithoutMe = currentChat.participants.filter((user) => user.uid != currentUser.uid);
    await updateChat(currentChat.id, { newParticipants: participantsWithoutMe });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Czy na pewno chcesz opuścić ten czat?</DialogTitle>
      <DialogActions>
        <Button onClick={onClose}>Anuluj</Button>
        <Button color="error" onClick={handleLeaveChat}>
          Opuść
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LeaveChatDialog;
