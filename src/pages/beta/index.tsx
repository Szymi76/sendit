import React, { useEffect, useState } from "react";
import { SimpleModal } from "../../components/components";
import { TextField, Button, Modal, Box, styled } from "@mui/material";
import { addDoc, collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "../../firebase";

// const StyledBox = styled(Box)({
//   backgroundColor: "red",
// });

// const TextModal = ({ children, open, setOpen }) => {
//   return (
//     <Modal
//       open={open}
//       onClose={() => setOpen(false)}
//       primarytext="Beta modal"
//       buttons={[{ label: "Zamknij", onClick: () => setOpen(false) }]}
//       sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
//     >
//       <StyledBox>{children}</StyledBox>
//     </Modal>
//   );
// };

const Beta = () => {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    const data = {
      name: "Some name",
      age: 18,
      hoobies: ["Washing dishes", "Cleaning kitchen"],
    };

    const ref = collection(firestore, "beta");
    const coll = collection(ref, "messages", "message");

    addDoc(coll, data).then((val) => {
      console.warn("Created!");
    });
  }, []);

  return (
    <>
      {/* <Button onClick={() => setOpen(true)}>Otwórz</Button>
      <TextModal open={open} setOpen={setOpen}>
        <TextField label="Text" value={text} onChange={(e) => setText(e.target.value)} />
      </TextModal> */}
    </>
  );
};

export default Beta;
