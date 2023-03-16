import { Box, CircularProgress } from "@mui/material";

// KRĘCONCE SIĘ KÓŁKO ŁADOWANIA PODZAS WYSYŁANIA WIADOMOŚCI
export const SendingMessage = () => {
  return (
    <Box display="flex" justifyContent="flex-end" mr={5} mb={3}>
      <CircularProgress color="primary" />
    </Box>
  );
};

export default SendingMessage;
