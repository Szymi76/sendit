import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";

import useChat from "../../../../hooks/useChat";

const LeaveChatDialog = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  const currentChat = useChat((state) => state.currentChat)!;
  const currentUser = useChat((state) => state.currentUser)!;
  const changeChatParticipants = useChat((state) => state.changeChatParticipants);

  // OPUSZCZANIE CZATU
  const handleLeaveChat = async () => {
    // @ts-ignore
    const participantsWithoutMe: string[] = currentChat.participants
      .map((user) => (user ? user.uid : null))
      .filter((uid) => uid !== null && uid != currentUser.uid);
    await changeChatParticipants(currentChat.id, participantsWithoutMe);
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
