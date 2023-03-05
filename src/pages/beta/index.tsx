import React, { useState } from "react";
import { SimpleModal } from "../../components/components";
import { TextField, Button, Modal, Box, styled } from "@mui/material";

const StyledBox = styled(Box)({
  backgroundColor: "red",
});

const TextModal = ({ children, open, setOpen }) => {
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      primarytext="Beta modal"
      buttons={[{ label: "Zamknij", onClick: () => setOpen(false) }]}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
      <StyledBox>{children}</StyledBox>
    </Modal>
  );
};

const Beta = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  return (
    <>
      <Button onClick={() => setOpen(true)}>Otwórz</Button>
      <TextModal open={open} setOpen={setOpen}>
        <TextField label="Text" value={text} onChange={(e) => setText(e.target.value)} />
      </TextModal>
    </>
  );
};

export default Beta;
